import * as THREE from "three";

const PantsModel = (style, color, fabric) => {
  // Create a group to hold all parts of the pants
  const pantsGroup = new THREE.Group();

  // Material based on fabric and color
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
  });

  // Create the main waistband
  const waistband = createWaistband(material);
  pantsGroup.add(waistband);

  // Create pant legs based on style
  const legs = createPantLegs(style, material);
  pantsGroup.add(legs);

  // Add details based on style
  const details = createDetails(style, material);
  pantsGroup.add(details);

  return pantsGroup;
};

// Helper function to create waistband
const createWaistband = (material) => {
  const waistbandGeometry = new THREE.CylinderGeometry(
    1.2,
    1.2,
    0.3,
    16,
    1,
    true
  );
  const waistband = new THREE.Mesh(waistbandGeometry, material);
  waistband.position.set(0, 1.0, 0);
  waistband.name = "pants-waistband";
  return waistband;
};

// Helper function to create pant legs based on style
const createPantLegs = (style, material) => {
  const legsGroup = new THREE.Group();

  let legGeometry;
  let leftLegPosition, rightLegPosition;

  switch (style) {
    case "straight":
      // Straight leg pants - consistent width
      legGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3.0, 8, 1, true);
      leftLegPosition = new THREE.Vector3(-0.6, -0.5, 0);
      rightLegPosition = new THREE.Vector3(0.6, -0.5, 0);
      break;

    case "skinny":
      // Skinny pants - taper towards ankle
      legGeometry = new THREE.CylinderGeometry(0.4, 0.25, 3.0, 8, 1, true);
      leftLegPosition = new THREE.Vector3(-0.55, -0.5, 0);
      rightLegPosition = new THREE.Vector3(0.55, -0.5, 0);
      break;

    case "bootcut":
      // Bootcut - slight flare at bottom
      legGeometry = new THREE.CylinderGeometry(0.4, 0.5, 3.0, 8, 1, true);
      leftLegPosition = new THREE.Vector3(-0.6, -0.5, 0);
      rightLegPosition = new THREE.Vector3(0.6, -0.5, 0);
      break;

    case "wide-leg":
      // Wide leg - dramatically wider
      legGeometry = new THREE.CylinderGeometry(0.4, 0.8, 3.0, 8, 1, true);
      leftLegPosition = new THREE.Vector3(-0.6, -0.5, 0);
      rightLegPosition = new THREE.Vector3(0.6, -0.5, 0);
      break;

    case "jogger":
      // Jogger - tapered with elastic at bottom
      legGeometry = new THREE.CylinderGeometry(0.45, 0.3, 2.8, 8, 1, true);
      leftLegPosition = new THREE.Vector3(-0.6, -0.4, 0);
      rightLegPosition = new THREE.Vector3(0.6, -0.4, 0);
      break;

    default:
      // Default straight leg
      legGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3.0, 8, 1, true);
      leftLegPosition = new THREE.Vector3(-0.6, -0.5, 0);
      rightLegPosition = new THREE.Vector3(0.6, -0.5, 0);
  }

  // Create left leg
  const leftLeg = new THREE.Mesh(legGeometry, material);
  leftLeg.position.copy(leftLegPosition);
  leftLeg.name = "pants-leg-left";

  // Create right leg
  const rightLeg = new THREE.Mesh(legGeometry, material);
  rightLeg.position.copy(rightLegPosition);
  rightLeg.name = "pants-leg-right";

  legsGroup.add(leftLeg);
  legsGroup.add(rightLeg);

  return legsGroup;
};

// Helper function to create details based on style
const createDetails = (style, material) => {
  const detailsGroup = new THREE.Group();

  // Create the hip/seat area connecting the legs to the waistband
  const hipGeometry = new THREE.BoxGeometry(1.4, 0.7, 0.4);
  const hip = new THREE.Mesh(hipGeometry, material);
  hip.position.set(0, 0.65, 0);
  hip.name = "pants-hip";
  detailsGroup.add(hip);

  // Add pockets
  const pocketGeometry = new THREE.PlaneGeometry(0.3, 0.25);
  const pocketMaterial = new THREE.MeshStandardMaterial({
    color: material.color,
    roughness: material.roughness,
    metalness: material.metalness,
    side: THREE.DoubleSide,
  });

  // Front pockets
  const leftPocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
  leftPocket.position.set(-0.6, 0.7, 0.21);
  leftPocket.name = "left-pocket";
  detailsGroup.add(leftPocket);

  const rightPocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
  rightPocket.position.set(0.6, 0.7, 0.21);
  rightPocket.name = "right-pocket";
  detailsGroup.add(rightPocket);

  // Style-specific details
  if (style === "jogger") {
    // Add elastic cuffs for joggers
    const leftCuff = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.05, 8, 16),
      material
    );
    leftCuff.position.set(-0.6, -2.3, 0);
    leftCuff.rotation.x = Math.PI / 2;
    leftCuff.name = "left-cuff";

    const rightCuff = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.05, 8, 16),
      material
    );
    rightCuff.position.set(0.6, -2.3, 0);
    rightCuff.rotation.x = Math.PI / 2;
    rightCuff.name = "right-cuff";

    detailsGroup.add(leftCuff);
    detailsGroup.add(rightCuff);
  }

  if (style === "bootcut" || style === "skinny" || style === "straight") {
    // Add button and zipper detail
    const button = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    button.position.set(0, 1.15, 0.21);
    button.rotation.x = Math.PI / 2;
    button.name = "button";

    const zipper = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.3, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    zipper.position.set(0, 0.95, 0.21);
    zipper.name = "zipper";

    detailsGroup.add(button);
    detailsGroup.add(zipper);
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

export default PantsModel;
