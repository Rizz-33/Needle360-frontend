import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaCompress, FaRedo, FaUndo } from "react-icons/fa";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  accessoryOptions,
  backgroundColorPresets,
  blouseTypes,
  customTypes,
  dressTypes,
  fabricTypes,
  garmentTypes,
  jacketTypes,
  pantsTypes,
  sizeOptions,
  skirtTypes,
  tshirtTypes,
} from "../../configs/Design.configs";
import { predefinedServices } from "../../configs/Services.configs";
import { useAuthStore } from "../../store/Auth.store";
import { useDesignStore } from "../../store/Design.store";
import BlouseModel from "./3D-Models/Blouse.model";
import DressModel from "./3D-Models/Dress.model";
import JacketModel from "./3D-Models/Jacket.model";
import PantsModel from "./3D-Models/Pants.model";
import TShirtModel from "./3D-Models/Shirt.model";
import SkirtModel from "./3D-Models/Skirt.model";

const FashionDesignTool = () => {
  const [activeGarment, setActiveGarment] = useState("tshirt");
  const [garmentStyle, setGarmentStyle] = useState("regular");
  const [fabricTexture, setFabricTexture] = useState("cotton");
  const [garmentColor, setGarmentColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#f0f0f0");
  const [garmentSize, setGarmentSize] = useState("medium");
  const [accessories, setAccessories] = useState([]);
  const [customText, setCustomText] = useState("");
  const [textProperties, setTextProperties] = useState({
    position: { x: 0, y: 0, z: 0.1 },
    rotation: 0,
    fontSize: 0.2,
    color: "#000000",
  });
  const [showCanvas, setShowCanvas] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [showRemoveAccessoriesPanel, setShowRemoveAccessoriesPanel] =
    useState(false);
  const [drawingMode, setDrawingMode] = useState("pattern");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelData, setCustomModelData] = useState(null);
  // Share modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareForm, setShareForm] = useState({
    itemName: "",
    description: "",
    price: "",
    tags: ["Custom Fashion Designs"],
  });
  const [shareError, setShareError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const lastPointRef = useRef(null);

  const { user, checkAuth } = useAuthStore();
  const { createCustomerDesign } = useDesignStore();

  const getStyleOptions = () => {
    switch (activeGarment) {
      case "tshirt":
        return tshirtTypes;
      case "blouse":
        return blouseTypes;
      case "dress":
        return dressTypes;
      case "pants":
        return pantsTypes;
      case "skirt":
        return skirtTypes;
      case "jacket":
        return jacketTypes;
      case "custom":
        return customTypes;
      default:
        return ["regular"];
    }
  };

  const saveDesign = () => {
    const designState = {
      activeGarment,
      garmentStyle,
      fabricTexture,
      garmentColor,
      backgroundColor,
      garmentSize,
      accessories,
      customText,
      textProperties,
      canvasData: canvasRef.current?.toDataURL(),
      isCustomModel,
      customModelData: isCustomModel ? customModelData : null,
    };
    localStorage.setItem("savedDesign", JSON.stringify(designState));
    alert("Design saved successfully!");
  };

  const loadDesign = () => {
    const savedDesign = localStorage.getItem("savedDesign");
    if (savedDesign) {
      const designState = JSON.parse(savedDesign);
      setActiveGarment(designState.activeGarment);
      setGarmentStyle(designState.garmentStyle);
      setFabricTexture(designState.fabricTexture);
      setGarmentColor(designState.garmentColor);
      setBackgroundColor(designState.backgroundColor);
      setGarmentSize(designState.garmentSize);
      setAccessories(designState.accessories);
      setCustomText(designState.customText);
      setTextProperties(designState.textProperties);
      setIsCustomModel(designState.isCustomModel || false);
      setCustomModelData(designState.customModelData || null);

      if (designState.canvasData && canvasRef.current) {
        const img = new Image();
        img.src = designState.canvasData;
        img.onload = () => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              stopDrawing();
            }
          }
        };
      }

      if (designState.isCustomModel && designState.customModelData) {
        loadGarmentModel("custom", designState.garmentStyle);
      }
    }
  };

  const importDesign = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.match(/\.(gltf|glb)$/)) {
      alert("Please select a valid GLTF or GLB file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const loader = new GLTFLoader();
      loader.parse(
        e.target.result,
        "",
        (gltf) => {
          if (!sceneRef.current || !modelRef.current) return;

          sceneRef.current.remove(modelRef.current);

          const model = gltf.scene;
          modelRef.current = model;
          sceneRef.current.add(model);

          setIsCustomModel(true);
          setCustomModelData(e.target.result);
          setActiveGarment("custom");
          setGarmentStyle("imported");

          updateGarmentProperties();
          saveStateToHistory();
        },
        (error) => {
          console.error("Error loading GLTF:", error);
          alert("Failed to load GLTF file.");
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const captureScreenshots = async () => {
    if (
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current ||
      !threeContainerRef.current
    ) {
      console.error(
        "Cannot capture screenshot: Renderer, scene, camera, or container not initialized."
      );
      return [];
    }

    if (!modelRef.current) {
      console.error("Cannot capture screenshot: 3D model not loaded.");
      return [];
    }

    try {
      if (!rendererRef.current.getContext()) {
        console.error("WebGL context is lost or not supported.");
        return [];
      }

      const container = threeContainerRef.current;
      const originalDisplay = container.style.display;
      const originalVisibility = container.style.visibility;
      if (
        container.offsetParent === null ||
        container.clientWidth === 0 ||
        container.clientHeight === 0
      ) {
        console.warn(
          "Container is not visible, attempting to make it visible..."
        );
        container.style.display = "block";
        container.style.visibility = "visible";
      }

      let width = container.clientWidth;
      let height = container.clientHeight;
      if (width <= 0 || height <= 0) {
        console.warn(
          `Invalid container size (${width}x${height}), using fallback size.`
        );
        width = 400;
        height = 300;
      }

      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      await new Promise((resolve) => setTimeout(resolve, 200));
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      const dataURL = rendererRef.current.domElement.toDataURL("image/png");

      container.style.display = originalDisplay;
      container.style.visibility = originalVisibility;

      if (!dataURL || !dataURL.startsWith("data:image/png")) {
        console.error("Invalid screenshot captured:", dataURL);
        return [];
      }

      return [dataURL];
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return [];
    }
  };

  const exportDesign = async (format) => {
    if (!modelRef.current || !rendererRef.current) return;

    if (format === "screenshot") {
      const screenshots = await captureScreenshots();
      if (screenshots.length === 0) {
        alert("Failed to capture screenshot. Please try again.");
        return;
      }
      const dataURL = screenshots[0];
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "design-screenshot.png";
      link.click();
      return;
    }

    const exporter = format === "gltf" ? new GLTFExporter() : new OBJExporter();
    const options = format === "gltf" ? { binary: true } : {};

    exporter.parse(
      modelRef.current,
      (result) => {
        let output;
        let mimeType;
        let extension;

        if (format === "gltf") {
          output =
            result instanceof ArrayBuffer ? result : JSON.stringify(result);
          mimeType =
            result instanceof ArrayBuffer
              ? "application/octet-stream"
              : "application/json";
          extension = result instanceof ArrayBuffer ? "glb" : "gltf";
        } else {
          output = result;
          mimeType = "text/plain";
          extension = "obj";
        }

        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `design.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
      },
      options
    );
  };

  const saveStateToHistory = () => {
    const currentState = {
      activeGarment,
      garmentStyle,
      fabricTexture,
      garmentColor,
      backgroundColor,
      garmentSize,
      accessories,
      customText,
      textProperties,
      canvasData: canvasRef.current?.toDataURL(),
      isCustomModel,
      customModelData: isCustomModel ? customModelData : null,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const prevIndex = historyIndex - 1;
    const prevState = history[prevIndex];
    applyState(prevState);
    setHistoryIndex(prevIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const nextState = history[nextIndex];
    applyState(nextState);
    setHistoryIndex(nextIndex);
  };

  const applyState = (state) => {
    setActiveGarment(state.activeGarment);
    setGarmentStyle(state.garmentStyle);
    setFabricTexture(state.fabricTexture);
    setGarmentColor(state.garmentColor);
    setBackgroundColor(state.backgroundColor);
    setGarmentSize(state.garmentSize);
    setAccessories(state.accessories);
    setCustomText(state.customText);
    setTextProperties(state.textProperties);
    setIsCustomModel(state.isCustomModel || false);
    setCustomModelData(state.customModelData || null);

    if (state.canvasData && canvasRef.current) {
      const img = new Image();
      img.src = state.canvasData;
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            ctx.drawImage(img, 0, 0);
            stopDrawing();
          }
        }
      };
    }

    if (sceneRef.current) {
      loadGarmentModel(state.activeGarment, state.garmentStyle);
    }
  };

  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth /
        threeContainerRef.current.clientHeight || 1,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const width = threeContainerRef.current.clientWidth || 800;
    const height = threeContainerRef.current.clientHeight || 600;
    renderer.setSize(width, height);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;

    if (!renderer.getContext()) {
      console.error("WebGL not supported or context lost");
      alert(
        "Your browser does not support WebGL. Please use a compatible browser."
      );
      return;
    }

    threeContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    loadGarmentModel(activeGarment, garmentStyle);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (
        !threeContainerRef.current ||
        !cameraRef.current ||
        !rendererRef.current
      )
        return;
      const width = threeContainerRef.current.clientWidth || 800;
      const height = threeContainerRef.current.clientHeight || 600;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    loadDesign();
    checkAuth();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (threeContainerRef.current && rendererRef.current) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!threeContainerRef.current || !rendererRef.current) return;

    const resizeTimeout = setTimeout(() => {
      if (rendererRef.current && threeContainerRef.current) {
        const width = threeContainerRef.current.clientWidth || 800;
        const height = threeContainerRef.current.clientHeight || 600;
        rendererRef.current.setSize(width, height);

        if (cameraRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
        }
      }
    }, 100);

    return () => clearTimeout(resizeTimeout);
  }, [showCanvas]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(backgroundColor);
      saveStateToHistory();
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (sceneRef.current) loadGarmentModel(activeGarment, garmentStyle);
    saveStateToHistory();
  }, [activeGarment, garmentStyle]);

  useEffect(() => {
    setGarmentStyle(getStyleOptions()[0]);
  }, [activeGarment]);

  useEffect(() => {
    if (modelRef.current) updateGarmentProperties();
    saveStateToHistory();
  }, [fabricTexture, garmentColor, garmentSize]);

  const getThreeColor = (hexColor) => {
    return new THREE.Color(hexColor);
  };

  const loadGarmentModel = (garmentType, style) => {
    if (!sceneRef.current) return;
    if (modelRef.current) sceneRef.current.remove(modelRef.current);

    let model;
    if (garmentType === "custom" && isCustomModel && customModelData) {
      const loader = new GLTFLoader();
      loader.parse(customModelData, "", (gltf) => {
        model = gltf.scene;
        modelRef.current = model;
        sceneRef.current.add(model);
        updateGarmentProperties();
      });
      return;
    }

    switch (garmentType) {
      case "tshirt":
        model = TShirtModel(style, garmentColor, fabricTexture);
        break;
      case "blouse":
        model = BlouseModel(style, garmentColor, fabricTexture);
        break;
      case "dress":
        model = DressModel(style, garmentColor, fabricTexture);
        break;
      case "pants":
        model = PantsModel(style, garmentColor, fabricTexture);
        break;
      case "skirt":
        model = SkirtModel(style, garmentColor, fabricTexture);
        break;
      case "jacket":
        model = JacketModel(style, garmentColor, fabricTexture);
        break;
      default:
        model = TShirtModel(style, garmentColor, fabricTexture);
    }

    sceneRef.current.add(model);
    modelRef.current = model;
    setIsCustomModel(false);
    setCustomModelData(null);
    updateGarmentProperties();
  };

  const updateGarmentProperties = () => {
    if (!modelRef.current) return;

    const threeColor = getThreeColor(garmentColor);

    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material && !child.name.includes("accessory")) {
        const newMaterial = new THREE.MeshStandardMaterial({
          color: threeColor,
          metalness: 0.1,
          roughness: 0.8,
          emissive: threeColor.clone().multiplyScalar(0.1),
          side: THREE.DoubleSide,
        });

        if (child.material.map) {
          newMaterial.map = child.material.map;
          newMaterial.transparent = true;
          newMaterial.needsUpdate = true;
        }

        child.material = Array.isArray(child.material)
          ? [newMaterial]
          : newMaterial;
      }
    });

    const sizeScale = getSizeScale(garmentSize);
    modelRef.current.scale.set(sizeScale, sizeScale, sizeScale);
  };

  const getSizeScale = (size) => {
    switch (size) {
      case "small":
        return 0.8;
      case "large":
        return 1.2;
      case "xlarge":
        return 1.4;
      case "medium":
      default:
        return 1.0;
    }
  };

  const addAccessory = (accessoryId) => {
    const accessoryToAdd = accessoryOptions.find(
      (acc) => acc.id === accessoryId
    );
    if (!accessoryToAdd || !modelRef.current) return;

    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.5,
      roughness: 0.5,
    });
    const accessoryMesh = new THREE.Mesh(geometry, material);
    accessoryMesh.name = `accessory_${accessoryId}_${Date.now()}`;

    let position;
    switch (accessoryToAdd.type) {
      case "basic":
        position = { x: 0, y: 0.5, z: 0.1 };
        break;
      case "decoration":
        position = { x: 0.2, y: 0, z: 0.2 };
        break;
      case "structure":
        position = { x: -0.2, y: 0.3, z: 0.1 };
        break;
      default:
        position = { x: 0, y: 0, z: 0 };
    }

    accessoryMesh.position.set(position.x, position.y, position.z);
    modelRef.current.add(accessoryMesh);

    setAccessories((prev) => [
      ...prev,
      {
        ...accessoryToAdd,
        meshId: accessoryMesh.name,
        position,
        scale: 1,
        rotation: 0,
      },
    ]);
    saveStateToHistory();
  };

  const removeAccessory = (index) => {
    if (!modelRef.current) return;

    const accessory = accessories[index];
    const mesh = modelRef.current.getObjectByName(accessory.meshId);
    if (mesh) modelRef.current.remove(mesh);

    setAccessories((prev) => prev.filter((_, i) => i !== index));
    saveStateToHistory();
  };

  const removeAllAccessories = () => {
    if (!modelRef.current) return;

    accessories.forEach((accessory) => {
      const mesh = modelRef.current.getObjectByName(accessory.meshId);
      if (mesh) modelRef.current.remove(mesh);
    });

    setAccessories([]);
    setShowRemoveAccessoriesPanel(false);
    saveStateToHistory();
  };

  const toggleRemoveAccessoriesPanel = () => {
    setShowRemoveAccessoriesPanel(!showRemoveAccessoriesPanel);
  };

  const addCustomText = () => {
    if (!customText.trim() || !modelRef.current) return;

    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const geometry = new THREE.TextGeometry(customText, {
          font: font,
          size: textProperties.fontSize,
          height: 0.05,
          curveSegments: 12,
        });

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(textProperties.color),
          metalness: 0.1,
          roughness: 0.7,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1.0,
        });

        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.name = `text_${Date.now()}`;
        textMesh.position.set(
          textProperties.position.x,
          textProperties.position.y,
          textProperties.position.z
        );
        textMesh.rotation.z = (textProperties.rotation * Math.PI) / 180;

        modelRef.current.add(textMesh);
        setCustomText("");
        saveStateToHistory();
      },
      undefined,
      (error) => {
        console.error("Error loading font:", error);
      }
    );
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 240;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (showCanvas) initCanvas();
  }, [showCanvas]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;

    const rect = canvas.getBoundingClientRect();
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top + canvas.parentElement.scrollTop,
    };
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top + canvas.parentElement.scrollTop,
    };

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPointRef.current = currentPoint;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && modelRef.current) {
      const texture = new THREE.CanvasTexture(canvas);
      texture.flipY = false;

      if (drawingMode === "pattern") {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
      } else {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(1, 1);
      }

      modelRef.current.traverse((child) => {
        if (child.isMesh && !child.name.includes("accessory")) {
          const newMaterial = new THREE.MeshStandardMaterial({
            color: getThreeColor(garmentColor),
            metalness: 0.1,
            roughness: 0.8,
            map: texture,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide,
          });

          newMaterial.needsUpdate = true;
          child.material = newMaterial;
        }
      });
    }
    saveStateToHistory();
  };

  const toggleCanvas = () => setShowCanvas(!showCanvas);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const openShareModal = () => {
    if (!user) {
      alert("Please log in to share your design.");
      return;
    }
    setShowShareModal(true);
    setShareError(null);
    setShareForm({
      itemName: "",
      description: "",
      price: "",
      tags: ["Custom Fashion Designs"],
    });
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareError(null);
  };

  const handleShareFormChange = (e) => {
    const { name, value } = e.target;
    setShareForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagToggle = (tag) => {
    setShareForm((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      if (!tags.includes("Custom Fashion Designs")) {
        tags.push("Custom Fashion Designs");
      }
      return { ...prev, tags };
    });
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShareError("You must be logged in to share a design.");
      console.error("User not authenticated");
      return;
    }

    if (!shareForm.itemName || !shareForm.price) {
      setShareError("Item name and price are required.");
      console.error("Missing itemName or price");
      return;
    }

    if (isNaN(shareForm.price) || Number(shareForm.price) <= 0) {
      setShareError("Price must be a valid positive number.");
      console.error("Invalid price:", shareForm.price);
      return;
    }

    if (!modelRef.current) {
      setShareError(
        "No 3D model loaded. Please select a garment and try again."
      );
      console.error("No 3D model loaded");
      return;
    }

    setIsSharing(true);
    setShareError(null);

    try {
      const screenshots = await captureScreenshots();

      if (screenshots.length === 0) {
        throw new Error(
          "Failed to capture screenshot of the 3D model. Please try again."
        );
      }

      // Store screenshot in localStorage with a temporary key
      const tempImageKey = `temp_design_image_${Date.now()}`;
      localStorage.setItem(tempImageKey, screenshots[0]);

      const designData = {
        title: shareForm.itemName,
        description: shareForm.description,
        price: Number(shareForm.price),
        image: screenshots[0],
        imageUrl: screenshots[0],
        imageURLs: screenshots,
        tags: shareForm.tags,
      };

      let response;
      try {
        response = await createCustomerDesign(user.id, designData);
      } catch (backendError) {
        console.error("Backend error:", backendError);
        throw new Error(
          `Backend failed to process the request: ${backendError.message}`
        );
      }

      if (!response || typeof response !== "object") {
        console.error("Invalid backend response:", response);
        throw new Error("Received an invalid response from the backend.");
      }

      // Store screenshot in localStorage with design ID
      if (response._id) {
        localStorage.setItem(`design_${response._id}_image`, screenshots[0]);
        localStorage.removeItem(tempImageKey);
      }

      // Check for image fields in response
      const returnedImage =
        response.image ||
        response.imageUrl ||
        (response.imageURLs && response.imageURLs[0]);
      if (!returnedImage) {
        console.warn(
          "Backend did not return valid image, imageUrl, or imageURLs. Using local screenshot as fallback.",
          "Response image:",
          response.image,
          "Response imageUrl:",
          response.imageUrl,
          "Response imageURLs:",
          response.imageURLs
        );
        response.image = screenshots[0];
        alert(
          "Design shared successfully, but the server did not save the image. The design will use the locally captured image. Please check your profile."
        );
      } else {
        alert("Design shared successfully!");
      }

      closeShareModal();
      saveDesign();
    } catch (error) {
      console.error("Error sharing design:", error);
      setShareError(
        error.message || "Failed to share design. Please try again."
      );
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (
        !threeContainerRef.current ||
        !cameraRef.current ||
        !rendererRef.current
      )
        return;
      const width = isFullScreen
        ? window.innerWidth
        : threeContainerRef.current.clientWidth || 800;
      const height = isFullScreen
        ? window.innerHeight
        : threeContainerRef.current.clientHeight || 600;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isFullScreen]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4">
            <button
              className="p-2 bg-gray-800 text-white rounded-full"
              onClick={toggleFullScreen}
              title="Exit Full Screen"
            >
              <FaCompress className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full h-full" ref={threeContainerRef}></div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Share Your Design</h2>
              <button
                onClick={closeShareModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {shareError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {shareError}
              </div>
            )}
            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={shareForm.itemName}
                  onChange={handleShareFormChange}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={shareForm.description}
                  onChange={handleShareFormChange}
                  className="w-full p-2 border rounded text-sm"
                  rows={4}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (LKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={shareForm.price}
                  onChange={handleShareFormChange}
                  className="w-full p-2 border rounded text-sm"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {predefinedServices.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-2 py-1 text-xs rounded-full ${
                        shareForm.tags.includes(tag)
                          ? "bg-secondary text-primary"
                          : "bg-secondary/15 text-gray-900"
                      } ${
                        tag === "Custom Fashion Designs"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={() => handleTagToggle(tag)}
                      disabled={tag === "Custom Fashion Designs"}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeShareModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSharing}
                  className={`px-4 py-2 bg-primary text-white rounded-full text-sm ${
                    isSharing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSharing ? "Sharing..." : "Share Design"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="md:hidden bg-yellow-100 p-3 text-center">
        <p className="text-sm font-medium text-yellow-800">
          For the best experience, please use a laptop or desktop computer.
        </p>
      </div>

      <header className="border-b border-primary p-2 flex items-center bg-primary/10 bg-grid-secondary/[0.2]">
        <a
          href="/design"
          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-primary/10"
          title="Browse Design"
        >
          <FaChevronLeft className="h-3 text-primary/80" />
        </a>
        <img src="/logo-black-short.png" alt="Logo" className="h-8 w-8 mx-2" />
        <h1 className="text-xs font-semibold pl-4 text-primary/80">
          Design Studio
        </h1>
        <div className="ml-auto flex gap-2">
          <button
            className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <FaUndo className="h-4 w-4" />
          </button>
          <button
            className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <FaRedo className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Design Options
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs mb-2 text-gray-600">Garment Type</h3>
              <div className="flex flex-wrap gap-1 mb-1">
                {garmentTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-2 py-1 rounded-full text-xs mb-1 ${
                      activeGarment === type
                        ? "bg-secondary text-primary"
                        : "bg-secondary/15 text-gray-900"
                    }`}
                    onClick={() => setActiveGarment(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs mb-1 text-gray-600">Style</h3>
              <div className="flex flex-wrap gap-1">
                {getStyleOptions().map((style) => (
                  <button
                    key={style}
                    className={`px-2 py-1 text-xs rounded-full mb-1 ${
                      garmentStyle === style
                        ? "bg-secondary text-primary"
                        : "bg-secondary/15 text-gray-900"
                    }`}
                    onClick={() => setGarmentStyle(style)}
                  >
                    {style
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs mb-1 text-gray-600">Fabric Type</h3>
              <select
                className="w-full p-1 border text-xs rounded-full"
                value={fabricTexture}
                onChange={(e) => setFabricTexture(e.target.value)}
              >
                {fabricTypes.map((fabric) => (
                  <option key={fabric} value={fabric}>
                    {fabric.charAt(0).toUpperCase() + fabric.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-xs mb-1 text-gray-600">Garment Color</h3>
              <input
                type="color"
                className="w-full h-8 border rounded cursor-pointer"
                value={garmentColor}
                onChange={(e) => setGarmentColor(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-xs mb-1 text-gray-600">Background Color</h3>
              <input
                type="color"
                className="w-full h-8 border rounded cursor-pointer mb-2"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
              <div className="flex flex-wrap gap-1">
                {backgroundColorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    className="px-2 py-1 text-xs rounded bg-secondary/15 text-gray-900"
                    onClick={() => setBackgroundColor(preset.value)}
                    style={{
                      borderBottom:
                        backgroundColor === preset.value
                          ? "2px solid #000"
                          : "none",
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs mb-1 text-gray-600">Size</h3>
              <div className="flex flex-wrap gap-1">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`px-2 py-1 rounded text-xs ${
                      garmentSize === size
                        ? "bg-secondary text-primary"
                        : "bg-secondary/15 text-gray-900"
                    }`}
                    onClick={() => setGarmentSize(size)}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                className="w-full px-3 py-2 text-xs bg-gradient-to-tl from-primary to-black via-hoverAccent text-white rounded-full"
                onClick={toggleCanvas}
              >
                {showCanvas ? "Hide Drawing Canvas" : "Show Drawing Canvas"}
              </button>
            </div>

            {showCanvas && (
              <div>
                <h3 className="text-xs mb-1 text-gray-600">Drawing Tools</h3>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs">Color:</span>
                  <input
                    type="color"
                    className="flex-1 h-6"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="flex-1 accent-primary h-1"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">Mode:</span>
                  <select
                    className="flex-1 p-1 border text-xs rounded-2xl"
                    value={drawingMode}
                    onChange={(e) => setDrawingMode(e.target.value)}
                  >
                    <option value="pattern">Pattern</option>
                    <option value="single">Single Element</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs mb-1 text-gray-600">Add Text</h3>
              <input
                type="text"
                className="w-full p-1 border rounded mb-1 text-xs"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text..."
              />
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs">Color:</span>
                <input
                  type="color"
                  className="flex-1 h-6"
                  value={textProperties.color}
                  onChange={(e) =>
                    setTextProperties((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs">Size:</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.1"
                  value={textProperties.fontSize}
                  onChange={(e) =>
                    setTextProperties((prev) => ({
                      ...prev,
                      fontSize: parseFloat(e.target.value),
                    }))
                  }
                  className="flex-1 accent-primary h-1"
                />
              </div>
              <button
                className="w-full px-3 py-2 text-xs bg-primary text-white rounded-full"
                onClick={addCustomText}
              >
                Add 3D Text
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto relative">
          <div
            className={`relative ${showCanvas ? "flex-1" : "h-full"}`}
            ref={threeContainerRef}
          >
            {showRemoveAccessoriesPanel && accessories.length > 0 && (
              <div className="absolute top-4 right-12 bg-white p-3 rounded-lg shadow-lg z-40 w-64 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold">Manage Accessories</h3>
                  <button
                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                    onClick={toggleRemoveAccessoriesPanel}
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2">
                  {accessories.map((acc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-secondary/30 p-2 rounded-full"
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-medium">{acc.name}</span>
                      </div>
                      <button
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded-full"
                        onClick={() => removeAccessory(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full mt-3 px-3 py-2 bg-red-500 text-white text-xs rounded-full"
                  onClick={removeAllAccessories}
                >
                  Remove All Accessories
                </button>
              </div>
            )}
          </div>

          {showCanvas && (
            <div className="h-48 border-t border-b relative">
              <canvas
                ref={canvasRef}
                className="w-full h-full bg-transparent"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
              />
            </div>
          )}

          <div className="p-2 bg-gray-100 border-t">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs text-gray-600">Accessories</h3>
              {accessories.length > 0 && (
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={toggleRemoveAccessoriesPanel}
                >
                  Manage Accessories
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {accessoryOptions.map((accessory) => (
                <button
                  key={accessory.id}
                  className="px-2 py-1 bg-white rounded border text-xs hover:bg-blue-50"
                  onClick={() => addAccessory(accessory.id)}
                >
                  + {accessory.name}
                </button>
              ))}
            </div>

            {accessories.length > 0 && (
              <div className="mt-2">
                <h4 className="text-xs mb-1 text-gray-600">
                  Applied Accessories: {accessories.length}
                </h4>
                <div className="space-y-1 max-h-24 overflow-hidden">
                  {accessories.slice(0, 3).map((acc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-blue-100 p-1 rounded text-xs"
                    >
                      <span>{acc.name}</span>
                      <div className="flex gap-1 items-center">
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={acc.scale}
                          onChange={(e) => {
                            const newAccessories = [...accessories];
                            newAccessories[idx].scale = parseFloat(
                              e.target.value
                            );
                            const mesh = modelRef.current.getObjectByName(
                              acc.meshId
                            );
                            if (mesh)
                              mesh.scale.setScalar(newAccessories[idx].scale);
                            setAccessories(newAccessories);
                            saveStateToHistory();
                          }}
                          className="w-16 accent-primary h-1"
                        />
                        <button
                          className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          onClick={() => removeAccessory(idx)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {accessories.length > 3 && (
                    <div
                      className="text-right text-xs text-primary hover:underline cursor-pointer"
                      onClick={toggleRemoveAccessoriesPanel}
                    >
                      +{accessories.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-64 bg-gray-100 p-4 overflow-y-auto flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Design Details
          </h2>

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-medium">Garment: </span>
              {activeGarment.charAt(0).toUpperCase() + activeGarment.slice(1)}
            </div>
            <div>
              <span className="font-medium">Style: </span>
              {garmentStyle
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </div>
            <div>
              <span className="font-medium">Fabric: </span>
              {fabricTexture.charAt(0).toUpperCase() + fabricTexture.slice(1)}
            </div>
            <div>
              <span className="font-medium">Size: </span>
              {garmentSize.charAt(0).toUpperCase() + garmentSize.slice(1)}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Accessories: </span>
                {accessories.length} items
              </div>
              {accessories.length > 0 && (
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={toggleRemoveAccessoriesPanel}
                >
                  Manage
                </button>
              )}
            </div>
            {accessories.length > 0 && (
              <div className="pl-2 pt-1 space-y-1">
                {accessories.slice(0, 5).map((acc, idx) => (
                  <div key={idx} className="text-xs text-gray-600">
                    • {acc.name}
                  </div>
                ))}
                {accessories.length > 5 && (
                  <div
                    className="text-xs text-primary hover:underline cursor-pointer"
                    onClick={toggleRemoveAccessoriesPanel}
                  >
                    +{accessories.length - 5} more...
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Export & Share
            </h3>
            <button
              className="w-full px-3 py-2 bg-primary text-white text-xs rounded-full mb-2"
              onClick={saveDesign}
            >
              Save Design
            </button>
            <button
              className="w-full px-3 py-2 bg-primary text-white text-xs rounded-full mb-2"
              onClick={openShareModal}
            >
              Share with Community
            </button>
            <label className="w-full px-3 py-2 bg-transparent text-primary text-xs rounded-full border border-primary flex items-center justify-center cursor-pointer mb-2">
              Import Design
              <input
                type="file"
                accept=".gltf,.glb"
                className="hidden"
                onChange={importDesign}
              />
            </label>
            <div className="space-y-2">
              <button
                className="w-full px-3 py-2 bg-transparent text-primary text-xs rounded-full border border-primary"
                onClick={() => exportDesign("gltf")}
              >
                Export as GLTF
              </button>
              <button
                className="w-full px-3 py-2 bg-transparent text-primary text-xs rounded-full border border-primary"
                onClick={() => exportDesign("obj")}
              >
                Export as OBJ
              </button>
              <button
                className="w-full px-3 py-2 bg-transparent text-primary text-xs rounded-full border border-primary"
                onClick={() => exportDesign("screenshot")}
              >
                Export as Screenshot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDesignTool;
