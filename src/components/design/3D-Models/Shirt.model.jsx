import * as THREE from "three";

const TShirtModel = (style, color, fabric) => {
  // Create a group to hold all parts of the t-shirt
  const tshirtGroup = new THREE.Group();

  // Material based on fabric and color
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
  });

  // Create the main body of the t-shirt
  const bodyGeometry = createTshirtBodyGeometry(style);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = "tshirt-body";
  tshirtGroup.add(body);

  // Add sleeves based on style
  if (style !== "sleeveless") {
    const sleeves = createSleeves(style, material);
    tshirtGroup.add(sleeves);
  }

  // Add collar based on style
  const collar = createCollar(style, material);
  tshirtGroup.add(collar);

  return tshirtGroup;
};

// Helper function to create t-shirt body shape
const createTshirtBodyGeometry = (style) => {
  // Create a base shape for the t-shirt body
  const shape = new THREE.Shape();

  // Main outline (slightly different based on style)
  if (style === "crop-top") {
    // Shorter torso for crop top
    shape.moveTo(-1, 1.3);
    shape.lineTo(1, 1.3);
    shape.lineTo(1, -0.5);
    shape.lineTo(-1, -0.5);
    shape.lineTo(-1, 1.3);
  } else {
    // Standard torso
    shape.moveTo(-1, 1.3);
    shape.lineTo(1, 1.3);
    shape.lineTo(1, -1.8);
    shape.lineTo(-1, -1.8);
    shape.lineTo(-1, 1.3);
  }

  // Create extruded geometry from shape
  const extrudeSettings = {
    steps: 1,
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

// Helper function to create sleeves based on style
const createSleeves = (style, material) => {
  const sleevesGroup = new THREE.Group();

  // Different sleeve geometry based on style
  let sleeveGeometry;
  if (style === "long-sleeve") {
    // Long sleeve - cylindrical shaped
    sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.25, 1.4, 8, 1, true);
  } else {
    // Short sleeve - shorter cylinder
    sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8, 1, true);
  }

  // Left sleeve
  const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
  leftSleeve.position.set(-1.15, 0.9, 0);
  leftSleeve.rotation.z = Math.PI / 2;
  leftSleeve.rotation.y = Math.PI / 6;
  leftSleeve.name = "sleeve-left";

  // Right sleeve
  const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
  rightSleeve.position.set(1.15, 0.9, 0);
  rightSleeve.rotation.z = -Math.PI / 2;
  rightSleeve.rotation.y = -Math.PI / 6;
  rightSleeve.name = "sleeve-right";

  sleevesGroup.add(leftSleeve);
  sleevesGroup.add(rightSleeve);
  return sleevesGroup;
};

// Helper function to create collar based on style
const createCollar = (style, material) => {
  let collarGeometry;

  switch (style) {
    case "v-neck":
      // V-neck collar
      const vShape = new THREE.Shape();
      vShape.moveTo(-0.4, 1.35);
      vShape.lineTo(0, 1.05);
      vShape.lineTo(0.4, 1.35);
      vShape.lineTo(0.6, 1.35);
      vShape.lineTo(0, 0.85);
      vShape.lineTo(-0.6, 1.35);
      collarGeometry = new THREE.ShapeGeometry(vShape);
      break;

    case "crew-neck":
      // Crew neck (round collar)
      collarGeometry = new THREE.RingGeometry(0.3, 0.5, 32, 1, 0, Math.PI);
      break;

    default:
      // Standard collar
      collarGeometry = new THREE.RingGeometry(0.35, 0.55, 32, 1, 0, Math.PI);
  }

  const collar = new THREE.Mesh(collarGeometry, material);
  collar.position.set(0, 1.3, 0.2);

  if (style === "crew-neck") {
    collar.rotation.x = -Math.PI / 2;
  }

  collar.name = "collar";
  return collar;
};

// Helper function to get fabric roughness
const getFabricRoughness = (fabric) => {
  switch (fabric) {
    case "silk":
      return 0.1;
    case "leather":
      return 0.7;
    case "denim":
      return 0.8;
    case "linen":
      return 0.6;
    case "cotton":
    default:
      return 0.5;
  }
};

// Helper function to get fabric metalness
const getFabricMetalness = (fabric) => {
  switch (fabric) {
    case "silk":
      return 0.2;
    case "leather":
      return 0.1;
    default:
      return 0;
  }
};

export default TShirtModel;
