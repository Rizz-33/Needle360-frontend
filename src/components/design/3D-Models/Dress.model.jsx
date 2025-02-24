import * as THREE from "three";

const DressModel = (style, color, fabric) => {
  // Create a group to hold all parts of the dress
  const dressGroup = new THREE.Group();

  // Material based on fabric and color
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
  });

  // Create the main body of the dress
  const bodyGeometry = createDressBodyGeometry(style);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = "dress-body";
  dressGroup.add(body);

  // Add top part details
  const topDetails = createTopDetails(style, material);
  dressGroup.add(topDetails);

  // Add skirt part
  const skirt = createSkirt(style, material);
  dressGroup.add(skirt);

  return dressGroup;
};

// Helper function to create dress body shape (top part)
const createDressBodyGeometry = (style) => {
  // Create a base shape for the dress top body
  const shape = new THREE.Shape();

  // Top part outline - similar for all dress types
  shape.moveTo(-1.1, 1.3);
  shape.lineTo(1.1, 1.3);
  shape.lineTo(1.1, -0.2); // Only go to waist level
  shape.lineTo(-1.1, -0.2);
  shape.lineTo(-1.1, 1.3);

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

// Helper function to create the skirt part based on style
const createSkirt = (style, material) => {
  let skirtGeometry;

  switch (style) {
    case "a-line":
      // A-line dress - widens towards the bottom
      const aLineShape = new THREE.Shape();
      aLineShape.moveTo(-1.1, 0);
      aLineShape.lineTo(1.1, 0);
      aLineShape.lineTo(2.0, -3.0);
      aLineShape.lineTo(-2.0, -3.0);
      aLineShape.lineTo(-1.1, 0);
      skirtGeometry = new THREE.ExtrudeGeometry(aLineShape, {
        steps: 1,
        depth: 0.5,
        bevelEnabled: false,
      });
      break;

    case "bodycon":
      // Bodycon - follows body shape tightly
      const bodyconShape = new THREE.Shape();
      bodyconShape.moveTo(-1.1, 0);
      bodyconShape.lineTo(1.1, 0);
      bodyconShape.lineTo(1.2, -2.4);
      bodyconShape.lineTo(-1.2, -2.4);
      bodyconShape.lineTo(-1.1, 0);
      skirtGeometry = new THREE.ExtrudeGeometry(bodyconShape, {
        steps: 1,
        depth: 0.5,
        bevelEnabled: false,
      });
      break;

    case "maxi":
      // Maxi - long flowing dress
      const maxiShape = new THREE.Shape();
      maxiShape.moveTo(-1.1, 0);
      maxiShape.lineTo(1.1, 0);
      maxiShape.lineTo(1.8, -4.0);
      maxiShape.lineTo(-1.8, -4.0);
      maxiShape.lineTo(-1.1, 0);
      skirtGeometry = new THREE.ExtrudeGeometry(maxiShape, {
        steps: 1,
        depth: 0.5,
        bevelEnabled: false,
      });
      break;

    case "midi":
      // Midi - medium length
      const midiShape = new THREE.Shape();
      midiShape.moveTo(-1.1, 0);
      midiShape.lineTo(1.1, 0);
      midiShape.lineTo(1.6, -2.5);
      midiShape.lineTo(-1.6, -2.5);
      midiShape.lineTo(-1.1, 0);
      skirtGeometry = new THREE.ExtrudeGeometry(midiShape, {
        steps: 1,
        depth: 0.5,
        bevelEnabled: false,
      });
      break;

    case "flare":
      // Flare - dramatic widening at bottom
      const flareShape = new THREE.Shape();
      flareShape.moveTo(-1.1, 0);
      flareShape.lineTo(1.1, 0);
      flareShape.lineTo(2.5, -2.8);
      flareShape.lineTo(-2.5, -2.8);
      flareShape.lineTo(-1.1, 0);
      skirtGeometry = new THREE.ExtrudeGeometry(flareShape, {
        steps: 1,
        depth: 0.5,
        bevelEnabled: false,
      });
      break;

    default:
      // Default midi length slightly flared dress
      const defaultShape = new THREE.Shape();
      defaultShape.moveTo(-1.1, 0);
      defaultShape.lineTo(1.1, 0);
      defaultShape.lineTo(1.5, -2.5);
      defaultShape.lineTo(-1.5, -2.5);
      defaultShape.lineTo(-1.1, 0);
      skirtGeometry = new THREE.ExtrudeGeometry(defaultShape, {
        steps: 1,
        depth: 0.5,
        bevelEnabled: false,
      });
  }

  const skirt = new THREE.Mesh(skirtGeometry, material);
  skirt.position.set(0, -0.2, 0);
  skirt.name = "dress-skirt";

  return skirt;
};

// Helper function to create top details based on style
const createTopDetails = (style, material) => {
  const detailsGroup = new THREE.Group();

  // Add straps/sleeves based on style
  let strapsGeometry;

  // Create neckline/collar
  const collarGeometry = new THREE.RingGeometry(0.3, 0.5, 32, 1, 0, Math.PI);
  const collar = new THREE.Mesh(collarGeometry, material);
  collar.position.set(0, 1.3, 0.25);
  collar.rotation.x = -Math.PI / 2;
  collar.name = "dress-collar";
  detailsGroup.add(collar);

  // Add appropriate straps based on style
  const leftStrap = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.7, 0.05),
    material
  );
  leftStrap.position.set(-0.5, 1.0, 0.25);
  leftStrap.rotation.z = Math.PI / 12;
  leftStrap.name = "left-strap";

  const rightStrap = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.7, 0.05),
    material
  );
  rightStrap.position.set(0.5, 1.0, 0.25);
  rightStrap.rotation.z = -Math.PI / 12;
  rightStrap.name = "right-strap";

  detailsGroup.add(leftStrap);
  detailsGroup.add(rightStrap);

  // Add style-specific details
  if (style === "bodycon") {
    // Add seam lines for bodycon
    const seamGeometry = new THREE.BoxGeometry(0.02, 1.5, 0.51);
    const leftSeam = new THREE.Mesh(seamGeometry, material);
    leftSeam.position.set(-0.6, 0.4, 0);
    detailsGroup.add(leftSeam);

    const rightSeam = new THREE.Mesh(seamGeometry, material);
    rightSeam.position.set(0.6, 0.4, 0);
    detailsGroup.add(rightSeam);
  }

  return detailsGroup;
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

export default DressModel;
