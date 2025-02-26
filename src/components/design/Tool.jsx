import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
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
  const [garmentSize, setGarmentSize] = useState("medium");
  const [accessories, setAccessories] = useState([]);
  const [customText, setCustomText] = useState("");
  const [textProperties, setTextProperties] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: 0,
    fontSize: 0.2,
    color: "#000000",
  });
  const [showCanvas, setShowCanvas] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [showRemoveAccessoriesPanel, setShowRemoveAccessoriesPanel] =
    useState(false);

  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const lastPointRef = useRef(null);

  const garmentTypes = [
    "tshirt",
    "blouse",
    "dress",
    "pants",
    "skirt",
    "jacket",
  ];

  const getStyleOptions = () => {
    switch (activeGarment) {
      case "tshirt":
        return ["regular", "v-neck", "crew-neck", "sleeveless", "long-sleeve"];
      case "blouse":
        return ["regular", "sleeveless", "long-sleeve", "ruffle", "crop-top"];
      case "dress":
        return ["a-line", "bodycon", "maxi", "midi", "flare"];
      case "pants":
        return ["straight", "skinny", "bootcut", "wide-leg", "jogger"];
      case "skirt":
        return ["a-line", "pencil", "pleated", "mini", "maxi"];
      case "jacket":
        return ["bomber", "blazer", "denim", "leather", "cropped"];
      default:
        return ["regular"];
    }
  };

  const fabricTypes = [
    "cotton",
    "silk",
    "denim",
    "leather",
    "linen",
    "wool",
    "chiffon",
  ];
  const sizeOptions = ["small", "medium", "large", "xlarge"];
  const accessoryOptions = [
    { id: "button", name: "Buttons", type: "basic" },
    { id: "zipper", name: "Zippers", type: "basic" },
    { id: "stone", name: "Rhinestones", type: "decoration" },
    { id: "sequin", name: "Sequins", type: "decoration" },
    { id: "patch", name: "Patches", type: "decoration" },
    { id: "collar", name: "Collars", type: "structure" },
    { id: "pocket", name: "Pockets", type: "structure" },
  ];

  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth /
        threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      threeContainerRef.current.clientWidth,
      threeContainerRef.current.clientHeight
    );
    threeContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

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
      cameraRef.current.aspect =
        threeContainerRef.current.clientWidth /
        threeContainerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        threeContainerRef.current.clientWidth,
        threeContainerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (threeContainerRef.current && rendererRef.current) {
        threeContainerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) loadGarmentModel(activeGarment, garmentStyle);
  }, [activeGarment, garmentStyle]);

  useEffect(() => {
    setGarmentStyle(getStyleOptions()[0]);
  }, [activeGarment]);

  useEffect(() => {
    if (modelRef.current) updateGarmentProperties();
  }, [fabricTexture, garmentColor, garmentSize]);

  const loadGarmentModel = (garmentType, style) => {
    if (!sceneRef.current) return;
    if (modelRef.current) sceneRef.current.remove(modelRef.current);

    let model;
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
    updateGarmentProperties();
  };

  const updateGarmentProperties = () => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material && !child.name.includes("accessory")) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.color.set(garmentColor);
          });
        } else {
          child.material.color.set(garmentColor);
        }
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
    const material = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 100,
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
  };

  const removeAccessory = (index) => {
    if (!modelRef.current) return;

    const accessory = accessories[index];
    const mesh = modelRef.current.getObjectByName(accessory.meshId);
    if (mesh) modelRef.current.remove(mesh);

    setAccessories((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllAccessories = () => {
    if (!modelRef.current) return;

    accessories.forEach((accessory) => {
      const mesh = modelRef.current.getObjectByName(accessory.meshId);
      if (mesh) modelRef.current.remove(mesh);
    });

    setAccessories([]);
    setShowRemoveAccessoriesPanel(false);
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

        const material = new THREE.MeshPhongMaterial({
          color: textProperties.color,
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
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Transparent background
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
      y: e.clientY - rect.top,
    };
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4); // Adjust repeat for pattern density

      modelRef.current.traverse((child) => {
        if (child.isMesh && !child.name.includes("accessory")) {
          let material = Array.isArray(child.material)
            ? child.material[0]
            : child.material;

          // Clone the material to avoid modifying the original
          const newMaterial = material.clone();
          newMaterial.map = texture;
          newMaterial.transparent = true;
          newMaterial.needsUpdate = true;

          child.material = newMaterial;
        }
      });
    }
  };

  const toggleCanvas = () => setShowCanvas(!showCanvas);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <header className="border-b border-primary p-2 flex items-center bg-primary/10 bg-grid-secondary/[0.2]">
        <img src="/logo-black-short.png" alt="Logo" className="h-8 w-8 mx-2" />
        <h1 className="text-xs font-semibold pl-4 text-primary/80">
          Design Studio
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Design Options */}
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
              <h3 className="text-xs mb-1 text-gray-600">Color</h3>
              <input
                type="color"
                className="w-full h-8 border rounded cursor-pointer"
                value={garmentColor}
                onChange={(e) => setGarmentColor(e.target.value)}
              />
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
                <div className="flex items-center gap-1">
                  <span className="text-xs">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 3D Model Container */}
          <div className="flex-1 relative" ref={threeContainerRef}>
            {/* Floating Remove Accessories Panel */}
            {showRemoveAccessoriesPanel && accessories.length > 0 && (
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10 w-64 max-h-96 overflow-y-auto">
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

          {/* Drawing Canvas (Optional) */}
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

          {/* Accessories Footer */}
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
                <div className="space-y-1 max-h-24 overflow-y-auto">
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

        {/* Right Sidebar - Design Details */}
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
              Export Options
            </h3>
            <button className="w-full px-3 py-2 bg-primary text-white text-xs rounded-full mb-2">
              Save Design
            </button>
            <button className="w-full px-3 py-2 bg-transparent text-primary text-xs rounded-full border border-primary">
              Export 3D Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDesignTool;
