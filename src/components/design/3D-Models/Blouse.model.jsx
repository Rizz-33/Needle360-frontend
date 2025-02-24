import * as THREE from "three";

const BlouseModel = (style, color, fabric) => {
  // Create a group to hold all parts of the blouse
  const blouseGroup = new THREE.Group();

  // Material based on fabric and color
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
  });

  // Create the main body of the blouse
  const bodyGeometry = createBlouseBodyGeometry(style);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = "blouse-body";
  blouseGroup.add(body);

  // Add sleeves based on style
  if (style !== "sleeveless") {
    const sleeves = createSleeves(style, material);
    blouseGroup.add(sleeves);
  }

  // Add collar based on style
  const collar = createCollar(style, material);
  blouseGroup.add(collar);

  // Add additional details based on style
  if (style === "ruffle") {
    const ruffles = createRuffles(material);
    blouseGroup.add(ruffles);
  }

  return blouseGroup;
};

// Helper function to create blouse body shape
const createBlouseBodyGeometry = (style) => {
  // Create a base shape for the blouse body
  const shape = new THREE.Shape();

  // Main outline (slightly different based on style)
  if (style === "crop-top") {
    // Shorter torso for crop top
    shape.moveTo(-1.1, 1.3);
    shape.lineTo(1.1, 1.3);
    shape.lineTo(1.3, -0.2);
    shape.lineTo(-1.3, -0.2);
  } else {
    // Standard blouse with slight flare at the bottom
    shape.moveTo(-1.1, 1.3);
    shape.lineTo(1.1, 1.3);
    shape.lineTo(1.4, -1.8);
    shape.lineTo(-1.4, -1.8);
  }

  shape.lineTo(-1.1, 1.3); // Close the shape

  // Create extruded geometry from shape
  const extrudeSettings = {
    steps: 1,
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
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
    // Long sleeve with slight flare at the wrist
    sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.6, 8, 1, true);
  } else if (style === "ruffle") {
    // Puffy, shorter sleeve
    sleeveGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 8, 1, true);
  } else {
    // Standard short sleeve
    sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.5, 8, 1, true);
  }

  // Left sleeve
  const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
  leftSleeve.position.set(-1.2, 0.9, 0);
  leftSleeve.rotation.z = Math.PI / 2;
  leftSleeve.rotation.y = Math.PI / 6;
  leftSleeve.name = "sleeve-left";

  // Right sleeve
  const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
  rightSleeve.position.set(1.2, 0.9, 0);
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
    case "ruffle":
      // Ruffled collar - more elaborate
      const ruffleShape = new THREE.Shape();
      ruffleShape.moveTo(-0.6, 0);
      ruffleShape.bezierCurveTo(-0.5, 0.1, -0.3, 0.15, 0, 0.2);
      ruffleShape.bezierCurveTo(0.3, 0.15, 0.5, 0.1, 0.6, 0);
      ruffleShape.bezierCurveTo(0.5, -0.05, 0.3, -0.1, 0, -0.1);
      ruffleShape.bezierCurveTo(-0.3, -0.1, -0.5, -0.05, -0.6, 0);
      collarGeometry = new THREE.ShapeGeometry(ruffleShape);
      break;

    case "crop-top":
      // Wide neck for crop top
      collarGeometry = new THREE.RingGeometry(0.4, 0.6, 32, 1, 0, Math.PI);
      break;

    default:
      // Standard blouse collar - more defined than t-shirt
      collarGeometry = new THREE.RingGeometry(0.3, 0.5, 32, 1, 0, Math.PI);
  }

  const collar = new THREE.Mesh(collarGeometry, material);
  collar.position.set(0, 1.3, 0.25);

  if (style !== "ruffle") {
    collar.rotation.x = -Math.PI / 2;
  }

  collar.name = "collar";
  return collar;
};

// Helper function to create ruffle details for the ruffle style
const createRuffles = (material) => {
  const rufflesGroup = new THREE.Group();

  // Create front ruffle
  const frontRuffleGeometry = new THREE.PlaneGeometry(0.8, 1.8);
  const frontRuffle = new THREE.Mesh(frontRuffleGeometry, material);
  frontRuffle.position.set(0, 0, 0.26);
  frontRuffle.name = "front-ruffle";

  // Create wavy edges for the ruffle effect
  const waveCount = 10;
  const waveAmplitude = 0.06;

  for (let i = 0; i < waveCount; i++) {
    const waveGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI);
    const wave = new THREE.Mesh(waveGeometry, material);

    const y = -0.8 + (i * 1.6) / waveCount;
    const x = i % 2 === 0 ? 0.4 : -0.4;

    wave.position.set(x, y, 0.26);
    wave.rotation.z = i % 2 === 0 ? 0 : Math.PI;
    wave.name = `ruffle-wave-${i}`;

    rufflesGroup.add(wave);
  }

  rufflesGroup.add(frontRuffle);
  return rufflesGroup;
};

// Helper function to get fabric roughness
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

// Helper function to get fabric metalness
const getFabricMetalness = (fabric) => {
  switch (fabric) {
    case "silk":
      return 0.2;
    case "chiffon":
      return 0.15;
    case "leather":
      return 0.1;
    default:
      return 0;
  }
};

export default BlouseModel;
