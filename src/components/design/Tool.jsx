import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import BlouseModel from "./3D-Models/Blouse.model";
import DressModel from "./3D-Models/Dress.model";
import JacketModel from "./3D-Models/Jacket.model";
import PantsModel from "./3D-Models/Pants.model";
import TShirtModel from "./3D-Models/Shirt.model";
import SkirtModel from "./3D-Models/Skirt.model";

// Main component for the Fashion Design Tool
const FashionDesignTool = () => {
  // State management for various design aspects
  const [activeGarment, setActiveGarment] = useState("tshirt");
  const [garmentStyle, setGarmentStyle] = useState("regular");
  const [fabricTexture, setFabricTexture] = useState("cotton");
  const [garmentColor, setGarmentColor] = useState("#ffffff");
  const [garmentSize, setGarmentSize] = useState("medium");
  const [accessories, setAccessories] = useState([]);
  const [customText, setCustomText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showCanvas, setShowCanvas] = useState(false); // Control canvas visibility

  // Canvas and 3D viewer references
  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);

  // Available options for the tool
  const garmentTypes = [
    "tshirt",
    "blouse",
    "dress",
    "pants",
    "skirt",
    "jacket",
  ];

  // Style options change based on garment type
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

  // Initialize 3D scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth /
        threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      threeContainerRef.current.clientWidth,
      threeContainerRef.current.clientHeight
    );
    threeContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Add controls for 3D navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Initial model loading
    loadGarmentModel(activeGarment, garmentStyle);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (threeContainerRef.current && rendererRef.current) {
        threeContainerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update model when garment type or style changes
  useEffect(() => {
    if (sceneRef.current) {
      loadGarmentModel(activeGarment, garmentStyle);
    }
  }, [activeGarment, garmentStyle]);

  // Reset style when changing garment type to prevent incompatible styles
  useEffect(() => {
    setGarmentStyle(getStyleOptions()[0]);
  }, [activeGarment]);

  // Update model when fabric, color, or size changes
  useEffect(() => {
    if (modelRef.current) {
      updateGarmentProperties();
    }
  }, [fabricTexture, garmentColor, garmentSize]);

  // Load 3D model based on garment type and style
  const loadGarmentModel = (garmentType, style) => {
    if (!sceneRef.current) return;

    // Clear existing model
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
    }

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

    // Update properties
    updateGarmentProperties();
  };

  // Update garment properties based on current selections
  const updateGarmentProperties = () => {
    if (!modelRef.current) return;

    // Update material color for all meshes in the model
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        // Only change color for main fabric parts, not accessories
        if (!child.name.includes("accessory")) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.color.set(garmentColor);
              mat.roughness = getFabricRoughness(fabricTexture);
              mat.metalness = getFabricMetalness(fabricTexture);
            });
          } else {
            child.material.color.set(garmentColor);
            child.material.roughness = getFabricRoughness(fabricTexture);
            child.material.metalness = getFabricMetalness(fabricTexture);
          }
        }
      }
    });

    // Update model scale based on size
    const sizeScale = getSizeScale(garmentSize);
    modelRef.current.scale.set(sizeScale, sizeScale, sizeScale);
  };

  // Helper functions for material properties
  const getFabricRoughness = (fabric) => {
    switch (fabric) {
      case "silk":
      case "chiffon":
        return 0.1;
      case "leather":
        return 0.7;
      case "denim":
        return 0.8;
      case "linen":
        return 0.6;
      case "wool":
        return 0.9;
      case "cotton":
      default:
        return 0.5;
    }
  };

  const getFabricMetalness = (fabric) => {
    switch (fabric) {
      case "silk":
        return 0.2;
      case "leather":
        return 0.1;
      case "chiffon":
        return 0.15;
      default:
        return 0;
    }
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

  // Handle adding accessories to the garment
  const addAccessory = (accessoryId) => {
    const accessoryToAdd = accessoryOptions.find(
      (acc) => acc.id === accessoryId
    );
    if (accessoryToAdd) {
      setAccessories([
        ...accessories,
        { ...accessoryToAdd, position: { x: 0, y: 0 } },
      ]);
    }
  };

  // Handle removing accessories from the garment
  const removeAccessory = (index) => {
    const newAccessories = [...accessories];
    newAccessories.splice(index, 1);
    setAccessories(newAccessories);
  };

  // Handle adding custom text to the garment
  const addCustomText = () => {
    if (customText.trim() === "") return;

    // In a real implementation, this would add the text to the 3D model
    console.log(
      `Adding text: ${customText} at position: (${textPosition.x}, ${textPosition.y})`
    );

    // Reset the text input
    setCustomText("");
  };

  // Toggle canvas visibility
  const toggleCanvas = () => {
    setShowCanvas(!showCanvas);
  };

  // Drawing functionality - in a real app, this would integrate with a canvas drawing API
  const handleCanvasDraw = (e) => {
    // Basic implementation - in a real app, use a proper drawing library
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="h-screen overflow-y-auto w-full">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Fashion Design Studio</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Design Options</h2>

          {/* Garment Type Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Garment Type</h3>
            <div className="space-y-2">
              {garmentTypes.map((type) => (
                <button
                  key={type}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    activeGarment === type
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveGarment(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Style</h3>
            <div className="space-y-2">
              {getStyleOptions().map((style) => (
                <button
                  key={style}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    garmentStyle === style
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setGarmentStyle(style)}
                >
                  {style
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Fabric Type</h3>
            <select
              className="w-full p-2 border rounded"
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

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Color</h3>
            <input
              type="color"
              className="w-full h-10 border rounded cursor-pointer"
              value={garmentColor}
              onChange={(e) => setGarmentColor(e.target.value)}
            />
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 rounded ${
                    garmentSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-white border"
                  }`}
                  onClick={() => setGarmentSize(size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Canvas Button */}
          <div className="mb-6">
            <button
              className="w-full px-3 py-2 bg-purple-500 text-white rounded"
              onClick={toggleCanvas}
            >
              {showCanvas ? "Hide Drawing Canvas" : "Show Drawing Canvas"}
            </button>
          </div>

          {/* Custom Text */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Add Text</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter text..."
            />
            <button
              className="w-full px-3 py-2 bg-blue-500 text-white rounded"
              onClick={addCustomText}
            >
              Add Text
            </button>
          </div>
        </div>

        {/* Center - Main working area */}
        <div className="flex-1 flex flex-col">
          {/* 3D Preview - Now positioned at the top */}
          <div className="flex-1" ref={threeContainerRef}></div>

          {/* Design Canvas (for 2D drawing and text) - Now optional and toggled */}
          {showCanvas && (
            <div className="h-64 border-t border-b relative">
              <canvas
                ref={canvasRef}
                className="w-full h-full bg-white"
                onMouseDown={handleCanvasDraw}
                onMouseMove={(e) => e.buttons === 1 && handleCanvasDraw(e)}
              />

              {/* Display text (simplified representation) */}
              {customText && (
                <div
                  className="absolute bg-gray-200 px-2 py-1 rounded text-xs cursor-move"
                  style={{
                    top: `${textPosition.y}px`,
                    left: `${textPosition.x}px`,
                  }}
                  draggable
                >
                  {customText}
                </div>
              )}
            </div>
          )}

          {/* Accessories Bar - Positioned below the 3D model */}
          <div className="p-4 bg-gray-100 border-t">
            <h3 className="font-medium mb-2">Accessories</h3>
            <div className="flex flex-wrap items-center gap-2">
              {accessoryOptions.map((accessory) => (
                <button
                  key={accessory.id}
                  className="px-3 py-1 bg-white rounded border text-sm hover:bg-blue-50"
                  onClick={() => addAccessory(accessory.id)}
                >
                  + {accessory.name}
                </button>
              ))}
            </div>

            {/* Display currently applied accessories */}
            {accessories.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">
                  Applied Accessories:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {accessories.map((acc, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <span>{acc.name}</span>
                      <button
                        className="ml-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        onClick={() => removeAccessory(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Preview/Details */}
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Design Details</h2>

          <div className="space-y-3">
            <div>
              <span className="font-medium">Garment: </span>
              <span>
                {activeGarment.charAt(0).toUpperCase() + activeGarment.slice(1)}
              </span>
            </div>

            <div>
              <span className="font-medium">Style: </span>
              <span>
                {garmentStyle
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </div>

            <div>
              <span className="font-medium">Fabric: </span>
              <span>
                {fabricTexture.charAt(0).toUpperCase() + fabricTexture.slice(1)}
              </span>
            </div>

            <div>
              <span className="font-medium">Size: </span>
              <span>
                {garmentSize.charAt(0).toUpperCase() + garmentSize.slice(1)}
              </span>
            </div>

            <div>
              <span className="font-medium">Accessories: </span>
              <span>{accessories.length} items</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Export Options</h3>
            <button className="w-full px-3 py-2 bg-green-500 text-white rounded mb-2">
              Save Design
            </button>
            <button className="w-full px-3 py-2 bg-blue-500 text-white rounded">
              Export 3D Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDesignTool;
