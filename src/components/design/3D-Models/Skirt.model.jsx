import * as THREE from "three";

const SkirtModel = (style, color, fabric) => {
  // Create a group to hold all parts of the skirt
  const skirtGroup = new THREE.Group();

  // Material based on fabric and color
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
  });

  // Create the main body of the skirt
  const bodyGeometry = createSkirtBodyGeometry(style);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = "skirt-body";
  skirtGroup.add(body);

  // Add waistband
  const waistband = createWaistband(style, material);
  skirtGroup.add(waistband);

  // Add pleats or other details based on style
  if (style === "pleated") {
    const pleats = createPleats(material);
    skirtGroup.add(pleats);
  }

  return skirtGroup;
};

// Helper function to create skirt body shape
const createSkirtBodyGeometry = (style) => {
  // Create a base shape for the skirt body
  const shape = new THREE.Shape();

  // Different shapes based on style
  switch (style) {
    case "a-line":
      // A-line skirt (wider at the bottom)
      shape.moveTo(-0.8, 0.5);
      shape.lineTo(0.8, 0.5);
      shape.lineTo(1.3, -1.8);
      shape.lineTo(-1.3, -1.8);
      shape.lineTo(-0.8, 0.5);
      break;

    case "pencil":
      // Pencil skirt (narrower)
      shape.moveTo(-0.8, 0.5);
      shape.lineTo(0.8, 0.5);
      shape.lineTo(0.9, -1.8);
      shape.lineTo(-0.9, -1.8);
      shape.lineTo(-0.8, 0.5);
      break;

    case "mini":
      // Mini skirt (shorter)
      shape.moveTo(-0.8, 0.5);
      shape.lineTo(0.8, 0.5);
      shape.lineTo(1.0, -0.8);
      shape.lineTo(-1.0, -0.8);
      shape.lineTo(-0.8, 0.5);
      break;

    case "maxi":
      // Maxi skirt (longer)
      shape.moveTo(-0.8, 0.5);
      shape.lineTo(0.8, 0.5);
      shape.lineTo(1.5, -2.5);
      shape.lineTo(-1.5, -2.5);
      shape.lineTo(-0.8, 0.5);
      break;

    default:
      // Default pleated skirt
      shape.moveTo(-0.8, 0.5);
      shape.lineTo(0.8, 0.5);
      shape.lineTo(1.2, -1.8);
      shape.lineTo(-1.2, -1.8);
      shape.lineTo(-0.8, 0.5);
  }

  // Create extruded geometry from shape
  const extrudeSettings = {
    steps: 1,
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.05,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

// Helper function to create waistband
const createWaistband = (style, material) => {
  // Create a cylinder for the waistband
  const waistbandGeometry = new THREE.CylinderGeometry(
    0.85,
    0.85,
    0.2,
    32,
    1,
    true
  );
  const waistband = new THREE.Mesh(waistbandGeometry, material);
  waistband.position.set(0, 0.6, 0);
  waistband.name = "waistband";
  return waistband;
};

// Helper function to create pleats for pleated skirt
const createPleats = (material) => {
  const pleatsGroup = new THREE.Group();

  // Create multiple pleats around the skirt
  const pleatCount = 16;
  const radius = 1.0;

  for (let i = 0; i < pleatCount; i++) {
    const angle = (i / pleatCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Create a simple box for each pleat
    const pleatGeometry = new THREE.BoxGeometry(0.1, 1.8, 0.05);
    const pleat = new THREE.Mesh(pleatGeometry, material);

    pleat.position.set(x, -0.7, z);
    pleat.lookAt(0, pleat.position.y, 0);
    pleat.name = `pleat-${i}`;

    pleatsGroup.add(pleat);
  }

  return pleatsGroup;
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
    case "leather":
      return 0.1;
    case "chiffon":
      return 0.15;
    default:
      return 0;
  }
};

export default SkirtModel;
