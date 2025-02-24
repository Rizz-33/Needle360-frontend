import * as THREE from "three";

const JacketModel = (style, color, fabric) => {
  // Create a group to hold all parts of the jacket
  const jacketGroup = new THREE.Group();

  // Material based on fabric and color
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
  });

  // Create specific materials for details
  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.8,
  });

  // Create the main body of the jacket
  const bodyGeometry = createJacketBodyGeometry(style);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = "jacket-body";
  jacketGroup.add(body);

  // Add sleeves
  const sleeves = createSleeves(style, material);
  jacketGroup.add(sleeves);

  // Add collar based on style
  const collar = createCollar(style, material);
  jacketGroup.add(collar);

  // Add buttons
  const buttons = createButtons(style, buttonMaterial);
  jacketGroup.add(buttons);

  // Add pockets for some styles
  if (["blazer", "denim", "bomber"].includes(style)) {
    const pockets = createPockets(style, material);
    jacketGroup.add(pockets);
  }

  return jacketGroup;
};

// Helper function to create jacket body shape
const createJacketBodyGeometry = (style) => {
  // Create a base shape for the jacket body
  const shape = new THREE.Shape();

  // Different shapes based on style
  switch (style) {
    case "cropped":
      // Cropped jacket (shorter)
      shape.moveTo(-1.1, 1.3);
      shape.lineTo(1.1, 1.3);
      shape.lineTo(1.1, -0.5);
      shape.lineTo(-1.1, -0.5);
      shape.lineTo(-1.1, 1.3);
      break;

    case "bomber":
      // Bomber jacket (bulkier with elastic bottom)
      shape.moveTo(-1.2, 1.3);
      shape.lineTo(1.2, 1.3);
      shape.lineTo(1.1, -1.5);
      shape.bezierCurveTo(0.8, -1.7, -0.8, -1.7, -1.1, -1.5);
      shape.lineTo(-1.2, 1.3);
      break;

    case "blazer":
      // Blazer (more formal with cut front)
      shape.moveTo(-1.1, 1.3);
      shape.lineTo(1.1, 1.3);
      shape.lineTo(1.1, -1.8);
      shape.lineTo(-1.1, -1.8);
      shape.lineTo(-1.1, 1.3);

      // Create a cut in the front for a lapel effect
      const hole = new THREE.Path();
      hole.moveTo(0, 1.3);
      hole.lineTo(0.5, 0.5);
      hole.lineTo(0, 0);
      hole.lineTo(-0.5, 0.5);
      hole.lineTo(0, 1.3);
      shape.holes.push(hole);
      break;

    default:
      // Default jacket shape
      shape.moveTo(-1.1, 1.3);
      shape.lineTo(1.1, 1.3);
      shape.lineTo(1.1, -1.8);
      shape.lineTo(-1.1, -1.8);
      shape.lineTo(-1.1, 1.3);
  }

  // Create extruded geometry from shape
  const extrudeSettings = {
    steps: 1,
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

// Helper function to create sleeves
const createSleeves = (style, material) => {
  const sleevesGroup = new THREE.Group();

  // Different sleeve geometry based on style
  let sleeveRadius = 0.3;
  let sleeveLength = 1.5;

  if (style === "bomber") {
    sleeveRadius = 0.35; // Bulkier sleeves for bomber
    sleeveLength = 1.4;
  } else if (style === "cropped") {
    sleeveLength = 1.2; // Shorter sleeves for cropped
  }

  const sleeveGeometry = new THREE.CylinderGeometry(
    sleeveRadius,
    sleeveRadius * 0.9,
    sleeveLength,
    12,
    1,
    true
  );

  // Left sleeve
  const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
  leftSleeve.position.set(-1.25, 0.9, 0);
  leftSleeve.rotation.z = Math.PI / 2;
  leftSleeve.rotation.y = Math.PI / 6;
  leftSleeve.name = "sleeve-left";

  // Right sleeve
  const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
  rightSleeve.position.set(1.25, 0.9, 0);
  rightSleeve.rotation.z = -Math.PI / 2;
  rightSleeve.rotation.y = -Math.PI / 6;
  rightSleeve.name = "sleeve-right";

  // Add cuffs for certain styles
  if (["bomber", "blazer"].includes(style)) {
    const cuffGeometry = new THREE.TorusGeometry(
      sleeveRadius,
      0.05,
      8,
      16,
      Math.PI * 2
    );

    const leftCuff = new THREE.Mesh(cuffGeometry, material);
    leftCuff.position.set(-1.25 - sleeveLength / 2, 0.9, 0);
    leftCuff.rotation.x = Math.PI / 2;
    leftCuff.name = "cuff-left";

    const rightCuff = new THREE.Mesh(cuffGeometry, material);
    rightCuff.position.set(1.25 + sleeveLength / 2, 0.9, 0);
    rightCuff.rotation.x = Math.PI / 2;
    rightCuff.name = "cuff-right";

    sleevesGroup.add(leftCuff);
    sleevesGroup.add(rightCuff);
  }

  sleevesGroup.add(leftSleeve);
  sleevesGroup.add(rightSleeve);
  return sleevesGroup;
};

// Helper function to create collar based on style
const createCollar = (style, material) => {
  let collarGeometry;
  const collarGroup = new THREE.Group();

  switch (style) {
    case "blazer":
      // Lapel collar for blazer
      const leftLapel = new THREE.Shape();
      leftLapel.moveTo(0, 1.3);
      leftLapel.lineTo(-0.6, 1.3);
      leftLapel.lineTo(-0.5, 0.5);
      leftLapel.lineTo(0, 0.7);

      const rightLapel = new THREE.Shape();
      rightLapel.moveTo(0, 1.3);
      rightLapel.lineTo(0.6, 1.3);
      rightLapel.lineTo(0.5, 0.5);
      rightLapel.lineTo(0, 0.7);

      const leftLapelMesh = new THREE.Mesh(
        new THREE.ShapeGeometry(leftLapel),
        material
      );
      leftLapelMesh.position.z = 0.3;

      const rightLapelMesh = new THREE.Mesh(
        new THREE.ShapeGeometry(rightLapel),
        material
      );
      rightLapelMesh.position.z = 0.3;

      collarGroup.add(leftLapelMesh);
      collarGroup.add(rightLapelMesh);
      break;

    case "bomber":
      // Ribbed collar for bomber jacket
      collarGeometry = new THREE.CylinderGeometry(0.6, 0.5, 0.3, 32, 3, true);
      const collar = new THREE.Mesh(collarGeometry, material);
      collar.position.set(0, 1.45, 0);
      collar.name = "collar";
      collarGroup.add(collar);
      break;

    case "denim":
      // Pointed collar for denim jacket
      const collarShape = new THREE.Shape();
      collarShape.moveTo(-0.7, 1.3);
      collarShape.lineTo(0.7, 1.3);
      collarShape.lineTo(0.9, 1.5);
      collarShape.lineTo(0, 1.7);
      collarShape.lineTo(-0.9, 1.5);
      collarShape.lineTo(-0.7, 1.3);

      const collarMesh = new THREE.Mesh(
        new THREE.ShapeGeometry(collarShape),
        material
      );
      collarMesh.position.z = 0.25;
      collarMesh.rotation.x = -Math.PI / 8;
      collarGroup.add(collarMesh);
      break;

    default:
      // Standard collar
      collarGeometry = new THREE.CylinderGeometry(0.55, 0.65, 0.2, 32, 1, true);
      const standardCollar = new THREE.Mesh(collarGeometry, material);
      standardCollar.position.set(0, 1.4, 0);
      standardCollar.name = "collar";
      collarGroup.add(standardCollar);
  }

  return collarGroup;
};

// Helper function to create buttons
const createButtons = (style, buttonMaterial) => {
  const buttonsGroup = new THREE.Group();

  // Different button layouts based on style
  let buttonCount = 3;
  let startY = 0.8;
  let spacing = 0.6;
  let buttonSize = 0.06;

  if (style === "blazer") {
    buttonCount = 2;
    startY = 0.5;
    spacing = 0.5;
    buttonSize = 0.07;
  } else if (style === "bomber") {
    buttonCount = 0; // Bomber typically has a zipper, not buttons

    // Create a zipper instead
    const zipperGeometry = new THREE.BoxGeometry(0.04, 2.0, 0.05);
    const zipper = new THREE.Mesh(zipperGeometry, buttonMaterial);
    zipper.position.set(0, -0.1, 0.3);
    zipper.name = "zipper";
    buttonsGroup.add(zipper);

    // Zipper pull
    const zipperPullGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8);
    const zipperPull = new THREE.Mesh(zipperPullGeometry, buttonMaterial);
    zipperPull.position.set(0.05, 0.4, 0.3);
    zipperPull.rotation.z = Math.PI / 2;
    zipperPull.name = "zipper-pull";
    buttonsGroup.add(zipperPull);
  }

  // Create buttons
  for (let i = 0; i < buttonCount; i++) {
    const buttonGeometry = new THREE.CylinderGeometry(
      buttonSize,
      buttonSize,
      0.02,
      16
    );
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(0, startY - i * spacing, 0.3);
    button.rotation.x = Math.PI / 2;
    button.name = `button-${i}`;
    buttonsGroup.add(button);
  }

  return buttonsGroup;
};

// Helper function to create pockets
const createPockets = (style, material) => {
  const pocketsGroup = new THREE.Group();

  // Different pocket designs based on style
  if (style === "blazer") {
    // Blazer pockets (flap pockets)
    const pocketGeometry = new THREE.PlaneGeometry(0.4, 0.3);
    const flapGeometry = new THREE.PlaneGeometry(0.4, 0.15);

    // Left pocket
    const leftPocket = new THREE.Mesh(pocketGeometry, material);
    leftPocket.position.set(-0.7, -0.8, 0.3);
    leftPocket.name = "pocket-left";

    const leftFlap = new THREE.Mesh(flapGeometry, material);
    leftFlap.position.set(-0.7, -0.65, 0.31);
    leftFlap.name = "pocket-flap-left";

    // Right pocket
    const rightPocket = new THREE.Mesh(pocketGeometry, material);
    rightPocket.position.set(0.7, -0.8, 0.3);
    rightPocket.name = "pocket-right";

    const rightFlap = new THREE.Mesh(flapGeometry, material);
    rightFlap.position.set(0.7, -0.65, 0.31);
    rightFlap.name = "pocket-flap-right";

    // Breast pocket
    const breastPocketGeometry = new THREE.PlaneGeometry(0.25, 0.2);
    const breastPocket = new THREE.Mesh(breastPocketGeometry, material);
    breastPocket.position.set(-0.7, 0.5, 0.3);
    breastPocket.name = "pocket-breast";

    pocketsGroup.add(
      leftPocket,
      leftFlap,
      rightPocket,
      rightFlap,
      breastPocket
    );
  } else if (style === "denim") {
    // Denim jacket pockets (patch pockets with button)
    const pocketGeometry = new THREE.PlaneGeometry(0.5, 0.4);
    const buttonGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.3,
      metalness: 0.8,
    });

    // Left pocket
    const leftPocket = new THREE.Mesh(pocketGeometry, material);
    leftPocket.position.set(-0.6, 0.2, 0.3);
    leftPocket.name = "pocket-left";

    const leftButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    leftButton.position.set(-0.6, 0.4, 0.31);
    leftButton.rotation.x = Math.PI / 2;
    leftButton.name = "pocket-button-left";

    // Right pocket
    const rightPocket = new THREE.Mesh(pocketGeometry, material);
    rightPocket.position.set(0.6, 0.2, 0.3);
    rightPocket.name = "pocket-right";

    const rightButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    rightButton.position.set(0.6, 0.4, 0.31);
    rightButton.rotation.x = Math.PI / 2;
    rightButton.name = "pocket-button-right";

    pocketsGroup.add(leftPocket, leftButton, rightPocket, rightButton);
  } else if (style === "bomber") {
    // Bomber jacket pockets (side welt pockets)
    const pocketGeometry = new THREE.PlaneGeometry(0.5, 0.1);

    // Left pocket
    const leftPocket = new THREE.Mesh(pocketGeometry, material);
    leftPocket.position.set(-0.65, -0.7, 0.3);
    leftPocket.rotation.z = -Math.PI / 12;
    leftPocket.name = "pocket-left";

    // Right pocket
    const rightPocket = new THREE.Mesh(pocketGeometry, material);
    rightPocket.position.set(0.65, -0.7, 0.3);
    rightPocket.rotation.z = Math.PI / 12;
    rightPocket.name = "pocket-right";

    // Arm pocket (typical of bomber jackets)
    const armPocketGeometry = new THREE.PlaneGeometry(0.2, 0.25);
    const armPocket = new THREE.Mesh(armPocketGeometry, material);
    armPocket.position.set(-1.2, 0.5, 0.35);
    armPocket.rotation.y = -Math.PI / 6;
    armPocket.name = "pocket-arm";

    pocketsGroup.add(leftPocket, rightPocket, armPocket);
  }

  return pocketsGroup;
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

export default JacketModel;
