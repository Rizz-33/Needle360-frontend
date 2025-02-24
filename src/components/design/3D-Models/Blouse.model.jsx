import * as THREE from "three";

const BlouseModel = (style, color, fabric, size = "medium") => {
  // Create a group to hold all parts of the blouse
  const blouseGroup = new THREE.Group();

  // Advanced material based on fabric and color
  const material = createFabricMaterial(fabric, color);

  // Create body measurements based on size
  const measurements = getSizeMeasurements(size);

  // Create the main body of the blouse with proper cloth physics simulation setup
  const bodyGeometry = createBlouseBodyGeometry(style, measurements);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = "blouse-body";
  body.castShadow = true;
  body.receiveShadow = true;
  blouseGroup.add(body);

  // Add sleeves based on style
  if (style !== "sleeveless") {
    const sleeves = createSleeves(style, material, measurements);
    blouseGroup.add(sleeves);
  }

  // Add collar based on style
  const collar = createCollar(style, material, measurements);
  blouseGroup.add(collar);

  // Add buttons and closures
  const closures = createClosures(style, material, measurements);
  blouseGroup.add(closures);

  // Add additional details based on style
  if (style === "ruffle") {
    const ruffles = createRuffles(material, measurements);
    blouseGroup.add(ruffles);
  }

  // Add cloth wrinkles and natural folds
  const wrinkles = createNaturalWrinkles(style, material, measurements);
  blouseGroup.add(wrinkles);

  // Add seams and stitching details
  const seams = createSeamsAndStitching(style, material, measurements);
  blouseGroup.add(seams);

  return blouseGroup;
};

// Create advanced fabric material with realistic properties
const createFabricMaterial = (fabric, color) => {
  // Load textures for realistic fabric appearance
  const textureLoader = new THREE.TextureLoader();

  // Base material properties
  const materialProps = {
    color: color,
    roughness: getFabricRoughness(fabric),
    metalness: getFabricMetalness(fabric),
    side: THREE.DoubleSide,
    transparent: isTransparent(fabric),
    opacity: getFabricOpacity(fabric),
  };

  // Add fabric-specific normal maps and textures
  const fabricTextures = getFabricTextures(fabric);

  if (fabricTextures.normal) {
    materialProps.normalMap = textureLoader.load(fabricTextures.normal);
    materialProps.normalScale = new THREE.Vector2(0.5, 0.5);
  }

  if (fabricTextures.roughness) {
    materialProps.roughnessMap = textureLoader.load(fabricTextures.roughness);
  }

  if (fabricTextures.displacement) {
    materialProps.displacementMap = textureLoader.load(
      fabricTextures.displacement
    );
    materialProps.displacementScale = 0.05;
  }

  if (fabricTextures.ao) {
    materialProps.aoMap = textureLoader.load(fabricTextures.ao);
    materialProps.aoMapIntensity = 0.8;
  }

  return new THREE.MeshStandardMaterial(materialProps);
};

// Get fabric-specific textures
const getFabricTextures = (fabric) => {
  // In a real application, these would be actual texture paths
  const textures = {
    normal: null,
    roughness: null,
    displacement: null,
    ao: null,
  };

  switch (fabric) {
    case "silk":
      textures.normal = "textures/silk/normal.jpg";
      textures.roughness = "textures/silk/roughness.jpg";
      break;
    case "cotton":
      textures.normal = "textures/cotton/normal.jpg";
      textures.roughness = "textures/cotton/roughness.jpg";
      textures.displacement = "textures/cotton/displacement.jpg";
      textures.ao = "textures/cotton/ao.jpg";
      break;
    case "denim":
      textures.normal = "textures/denim/normal.jpg";
      textures.roughness = "textures/denim/roughness.jpg";
      textures.displacement = "textures/denim/displacement.jpg";
      textures.ao = "textures/denim/ao.jpg";
      break;
    case "linen":
      textures.normal = "textures/linen/normal.jpg";
      textures.roughness = "textures/linen/roughness.jpg";
      textures.displacement = "textures/linen/displacement.jpg";
      break;
    case "leather":
      textures.normal = "textures/leather/normal.jpg";
      textures.roughness = "textures/leather/roughness.jpg";
      textures.displacement = "textures/leather/displacement.jpg";
      textures.ao = "textures/leather/ao.jpg";
      break;
    case "wool":
      textures.normal = "textures/wool/normal.jpg";
      textures.roughness = "textures/wool/roughness.jpg";
      textures.displacement = "textures/wool/displacement.jpg";
      break;
    case "chiffon":
      textures.normal = "textures/chiffon/normal.jpg";
      textures.roughness = "textures/chiffon/roughness.jpg";
      break;
  }

  return textures;
};

// Get size measurements for different body types
const getSizeMeasurements = (size) => {
  // Scale factors for different sizes
  const sizeScales = {
    xs: 0.85,
    small: 0.92,
    medium: 1.0,
    large: 1.08,
    xl: 1.15,
    xxl: 1.25,
  };

  const scale = sizeScales[size] || 1.0;

  return {
    bust: 1.1 * scale,
    waist: 1.0 * scale,
    hip: 1.2 * scale,
    length: 1.8 * scale,
    shoulderWidth: 1.1 * scale,
    armholeDepth: 0.4 * scale,
    sleeveLength: {
      "short-sleeve": 0.5 * scale,
      "long-sleeve": 1.6 * scale,
      ruffle: 0.6 * scale,
      sleeveless: 0,
    },
  };
};

// Helper function to create blouse body geometry with smooth curves and natural draping
const createBlouseBodyGeometry = (style, measurements) => {
  // Use Bezier curves for a more natural shape instead of straight lines
  const shape = new THREE.Shape();

  // Different shapes based on style
  switch (style) {
    case "crop-top":
      // Shorter crop top with more fitted shape
      shape.moveTo(-measurements.bust, measurements.shoulderWidth);

      // Right shoulder
      shape.bezierCurveTo(
        -measurements.bust / 2,
        measurements.shoulderWidth,
        -measurements.bust / 4,
        measurements.shoulderWidth + 0.1,
        0,
        measurements.shoulderWidth
      );

      // Left shoulder
      shape.bezierCurveTo(
        measurements.bust / 4,
        measurements.shoulderWidth + 0.1,
        measurements.bust / 2,
        measurements.shoulderWidth,
        measurements.bust,
        measurements.shoulderWidth
      );

      // Left side curve
      shape.bezierCurveTo(
        measurements.bust + 0.2,
        measurements.shoulderWidth - 0.3,
        measurements.bust + 0.3,
        measurements.shoulderWidth / 2,
        measurements.waist + 0.2,
        -0.2
      );

      // Bottom edge
      shape.lineTo(-measurements.waist - 0.2, -0.2);

      // Right side curve
      shape.bezierCurveTo(
        -measurements.bust - 0.3,
        measurements.shoulderWidth / 2,
        -measurements.bust - 0.2,
        measurements.shoulderWidth - 0.3,
        -measurements.bust,
        measurements.shoulderWidth
      );
      break;

    case "ruffle":
      // More volume for ruffle style
      shape.moveTo(-measurements.bust, measurements.shoulderWidth);

      // Right shoulder
      shape.bezierCurveTo(
        -measurements.bust / 2,
        measurements.shoulderWidth + 0.1,
        -measurements.bust / 4,
        measurements.shoulderWidth + 0.15,
        0,
        measurements.shoulderWidth + 0.1
      );

      // Left shoulder
      shape.bezierCurveTo(
        measurements.bust / 4,
        measurements.shoulderWidth + 0.15,
        measurements.bust / 2,
        measurements.shoulderWidth + 0.1,
        measurements.bust,
        measurements.shoulderWidth
      );

      // Left side with slight flare
      shape.bezierCurveTo(
        measurements.bust + 0.2,
        measurements.shoulderWidth - 0.4,
        measurements.hip + 0.3,
        measurements.shoulderWidth - 1.0,
        measurements.hip + 0.4,
        -measurements.length
      );

      // Bottom with slight curve
      shape.bezierCurveTo(
        measurements.hip + 0.2,
        -measurements.length - 0.1,
        -measurements.hip - 0.2,
        -measurements.length - 0.1,
        -measurements.hip - 0.4,
        -measurements.length
      );

      // Right side with slight flare
      shape.bezierCurveTo(
        -measurements.hip - 0.3,
        measurements.shoulderWidth - 1.0,
        -measurements.bust - 0.2,
        measurements.shoulderWidth - 0.4,
        -measurements.bust,
        measurements.shoulderWidth
      );
      break;

    default:
      // Standard blouse with natural curves
      shape.moveTo(-measurements.bust, measurements.shoulderWidth);

      // Right shoulder
      shape.bezierCurveTo(
        -measurements.bust / 2,
        measurements.shoulderWidth + 0.05,
        -measurements.bust / 4,
        measurements.shoulderWidth + 0.08,
        0,
        measurements.shoulderWidth
      );

      // Left shoulder
      shape.bezierCurveTo(
        measurements.bust / 4,
        measurements.shoulderWidth + 0.08,
        measurements.bust / 2,
        measurements.shoulderWidth + 0.05,
        measurements.bust,
        measurements.shoulderWidth
      );

      // Left side with slight curve inward at waist
      shape.bezierCurveTo(
        measurements.bust + 0.15,
        measurements.shoulderWidth - 0.3,
        measurements.waist + 0.1,
        0,
        measurements.hip + 0.3,
        -measurements.length
      );

      // Bottom hem with slight curve
      shape.bezierCurveTo(
        measurements.hip,
        -measurements.length - 0.1,
        -measurements.hip,
        -measurements.length - 0.1,
        -measurements.hip - 0.3,
        -measurements.length
      );

      // Right side with slight curve inward at waist
      shape.bezierCurveTo(
        -measurements.waist - 0.1,
        0,
        -measurements.bust - 0.15,
        measurements.shoulderWidth - 0.3,
        -measurements.bust,
        measurements.shoulderWidth
      );
  }

  // Create extruded geometry with more refined settings
  const extrudeSettings = {
    steps: 2,
    depth: measurements.bust * 0.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 5,
    curveSegments: 12, // More segments for smoother curves
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

// Helper function to create sleeves with natural folds and draping
const createSleeves = (style, material, measurements) => {
  const sleevesGroup = new THREE.Group();

  // Get sleeve length based on style
  const sleeveLength =
    measurements.sleeveLength[style] ||
    measurements.sleeveLength["short-sleeve"];

  // Different sleeve geometry based on style
  let sleeveGeometry;

  switch (style) {
    case "long-sleeve":
      // Create tapered long sleeve with natural bend at elbow
      const longSleeveShape = new THREE.Shape();
      const elbowPoint = sleeveLength * 0.6;

      // Create curved path for sleeve with natural bend
      const longSleeveCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -elbowPoint * 0.3, 0.2),
        new THREE.Vector3(0, -elbowPoint * 0.7, 0.3),
        new THREE.Vector3(0, -sleeveLength, 0.1)
      );

      // Create curved, tapered sleeve
      const longSleeveRadius = {
        shoulder: 0.35 * measurements.shoulderWidth,
        elbow: 0.3 * measurements.shoulderWidth,
        wrist: 0.2 * measurements.shoulderWidth,
      };

      const longSleevePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -elbowPoint, 0.25),
        new THREE.Vector3(0, -sleeveLength, 0.1),
      ]);

      const longSleeveRadii = [
        longSleeveRadius.shoulder,
        longSleeveRadius.elbow,
        longSleeveRadius.wrist,
      ];

      sleeveGeometry = createTaperedTubeGeometry(
        longSleevePath,
        20,
        longSleeveRadii,
        8,
        false
      );
      break;

    case "ruffle":
      // Create puffy sleeve with gathered fabric at shoulder and cuff
      const ruffleSleeveShape = new THREE.Shape();

      // Puffy sleeve with gathered effect
      const ruffleSleeveRadius = {
        shoulder: 0.4 * measurements.shoulderWidth,
        middle: 0.5 * measurements.shoulderWidth, // Wider in the middle for puff
        cuff: 0.3 * measurements.shoulderWidth,
      };

      const rufflePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -sleeveLength * 0.3, 0.2),
        new THREE.Vector3(0, -sleeveLength * 0.5, 0.25),
        new THREE.Vector3(0, -sleeveLength, 0),
      ];

      const ruffleSleevePath = new THREE.CatmullRomCurve3(rufflePoints);
      const ruffleSleeveRadii = [
        ruffleSleeveRadius.shoulder,
        ruffleSleeveRadius.middle,
        ruffleSleeveRadius.middle,
        ruffleSleeveRadius.cuff,
      ];

      sleeveGeometry = createTaperedTubeGeometry(
        ruffleSleevePath,
        24,
        ruffleSleeveRadii,
        12,
        false
      );
      break;

    default:
      // Short sleeve with slight taper
      const shortSleeveShape = new THREE.Shape();

      const shortSleeveRadius = {
        shoulder: 0.35 * measurements.shoulderWidth,
        end: 0.32 * measurements.shoulderWidth,
      };

      const shortSleevePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -sleeveLength * 0.5, 0.1),
        new THREE.Vector3(0, -sleeveLength, 0.05),
      ]);

      const shortSleeveRadii = [
        shortSleeveRadius.shoulder,
        shortSleeveRadius.shoulder * 0.95,
        shortSleeveRadius.end,
      ];

      sleeveGeometry = createTaperedTubeGeometry(
        shortSleevePath,
        16,
        shortSleeveRadii,
        8,
        false
      );
  }

  // Position and orientation for left sleeve
  const leftSleeve = new THREE.Mesh(sleeveGeometry.clone(), material);
  leftSleeve.position.set(
    -measurements.bust * 0.9,
    measurements.shoulderWidth * 0.8,
    0
  );
  leftSleeve.rotation.z = Math.PI / 2;
  leftSleeve.rotation.y = Math.PI / 6;
  leftSleeve.name = "sleeve-left";
  leftSleeve.castShadow = true;
  leftSleeve.receiveShadow = true;

  // Position and orientation for right sleeve
  const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
  rightSleeve.position.set(
    measurements.bust * 0.9,
    measurements.shoulderWidth * 0.8,
    0
  );
  rightSleeve.rotation.z = -Math.PI / 2;
  rightSleeve.rotation.y = -Math.PI / 6;
  rightSleeve.name = "sleeve-right";
  rightSleeve.castShadow = true;
  rightSleeve.receiveShadow = true;

  sleevesGroup.add(leftSleeve);
  sleevesGroup.add(rightSleeve);

  // Add sleeve details like cuffs or hems
  if (style === "long-sleeve") {
    const cuffs = createCuffs(material, measurements);
    sleevesGroup.add(cuffs);
  }

  return sleevesGroup;
};

// Create a tapered tube with varying radius along its length
const createTaperedTubeGeometry = (
  path,
  tubularSegments,
  radii,
  radialSegments,
  closed
) => {
  const frames = path.computeFrenetFrames(tubularSegments, closed);
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Create points around the path
  for (let i = 0; i <= tubularSegments; i++) {
    const u = i / tubularSegments;
    const point = path.getPointAt(u);
    const normal = frames.normals[Math.min(i, tubularSegments - 1)];
    const binormal = frames.binormals[Math.min(i, tubularSegments - 1)];

    // Calculate radius at this point (linear interpolation between provided radii)
    let radius;
    if (i === tubularSegments) {
      radius = radii[radii.length - 1];
    } else {
      const segment = (radii.length - 1) * (i / tubularSegments);
      const index = Math.floor(segment);
      const fraction = segment - index;
      radius =
        radii[index] * (1 - fraction) +
        radii[Math.min(index + 1, radii.length - 1)] * fraction;
    }

    // Create points around the circumference
    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments;
      const angle = v * Math.PI * 2;

      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // Calculate position
      const x = point.x + radius * (cos * normal.x + sin * binormal.x);
      const y = point.y + radius * (cos * normal.y + sin * binormal.y);
      const z = point.z + radius * (cos * normal.z + sin * binormal.z);

      vertices.push(x, y, z);

      // Calculate normal
      const nx = cos * normal.x + sin * binormal.x;
      const ny = cos * normal.y + sin * binormal.y;
      const nz = cos * normal.z + sin * binormal.z;

      normals.push(nx, ny, nz);

      // UV coordinates
      uvs.push(u, v);
    }
  }

  // Generate indices for triangles
  const vertsPerRow = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * vertsPerRow + j;
      const b = i * vertsPerRow + j + 1;
      const c = (i + 1) * vertsPerRow + j + 1;
      const d = (i + 1) * vertsPerRow + j;

      // Two triangles per quad
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Set attributes
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
};

// Helper function to create cuffs for long sleeves
const createCuffs = (material, measurements) => {
  const cuffsGroup = new THREE.Group();
  const cuffWidth = 0.15;
  const cuffRadius = 0.2 * measurements.shoulderWidth;

  // Create cuff geometry
  const cuffGeometry = new THREE.TorusGeometry(
    cuffRadius,
    cuffWidth,
    8,
    16,
    Math.PI * 2
  );

  // Left cuff
  const leftCuff = new THREE.Mesh(cuffGeometry, material);
  leftCuff.position.set(
    -measurements.bust * 0.9,
    measurements.shoulderWidth * 0.8 - measurements.sleeveLength["long-sleeve"],
    0.1
  );
  leftCuff.rotation.x = Math.PI / 2;
  leftCuff.name = "left-cuff";

  // Right cuff
  const rightCuff = new THREE.Mesh(cuffGeometry, material);
  rightCuff.position.set(
    measurements.bust * 0.9,
    measurements.shoulderWidth * 0.8 - measurements.sleeveLength["long-sleeve"],
    0.1
  );
  rightCuff.rotation.x = Math.PI / 2;
  rightCuff.name = "right-cuff";

  cuffsGroup.add(leftCuff);
  cuffsGroup.add(rightCuff);

  return cuffsGroup;
};

// Helper function to create collar with natural drape
const createCollar = (style, material, measurements) => {
  let collarGeometry;

  switch (style) {
    case "ruffle":
      // Elaborate ruffled collar with natural waves
      const ruffleCollarShape = new THREE.Shape();
      const collarRadius = 0.6 * measurements.bust;

      // Start at center front
      ruffleCollarShape.moveTo(0, 0);

      // Create a wavy, ruffled edge with multiple control points
      const segments = 12;
      const waveHeight = 0.1;
      const innerRadius = collarRadius * 0.6;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI;
        const x = Math.cos(angle) * collarRadius;
        const y = Math.sin(angle) * collarRadius;

        // Add wave pattern to outer edge
        const waveOffset = i % 2 === 0 ? waveHeight : -waveHeight / 2;
        const waveX = x * (1 + waveOffset * 0.2);
        const waveY = y * (1 + waveOffset * 0.2);

        if (i === 0) {
          ruffleCollarShape.lineTo(waveX, waveY);
        } else {
          // Use bezier curves for smooth waves
          const prevI = i - 1;
          const prevAngle = (prevI / segments) * Math.PI;
          const prevX = Math.cos(prevAngle) * collarRadius;
          const prevY = Math.sin(prevAngle) * collarRadius;
          const prevWaveOffset = prevI % 2 === 0 ? waveHeight : -waveHeight / 2;
          const prevWaveX = prevX * (1 + prevWaveOffset * 0.2);
          const prevWaveY = prevY * (1 + prevWaveOffset * 0.2);

          const ctrlX1 = prevWaveX + (waveX - prevWaveX) * 0.3;
          const ctrlY1 = prevWaveY + (waveY - prevWaveY) * 0.1;
          const ctrlX2 = prevWaveX + (waveX - prevWaveX) * 0.7;
          const ctrlY2 = prevWaveY + (waveY - prevWaveY) * 0.9;

          ruffleCollarShape.bezierCurveTo(
            ctrlX1,
            ctrlY1,
            ctrlX2,
            ctrlY2,
            waveX,
            waveY
          );
        }
      }

      // Create inner edge of collar
      for (let i = segments; i >= 0; i--) {
        const angle = (i / segments) * Math.PI;
        const x = Math.cos(angle) * innerRadius;
        const y = Math.sin(angle) * innerRadius;

        if (i === segments) {
          ruffleCollarShape.lineTo(x, y);
        } else {
          // Use bezier curves for smooth inner edge
          const nextI = i + 1;
          const nextAngle = (nextI / segments) * Math.PI;
          const nextX = Math.cos(nextAngle) * innerRadius;
          const nextY = Math.sin(nextAngle) * innerRadius;

          const ctrlX1 = x + (nextX - x) * 0.7;
          const ctrlY1 = y + (nextY - y) * 0.9;
          const ctrlX2 = x + (nextX - x) * 0.3;
          const ctrlY2 = y + (nextY - y) * 0.1;

          ruffleCollarShape.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, x, y);
        }
      }

      // Close the shape
      ruffleCollarShape.lineTo(0, 0);

      // Create shape geometry with proper segmentation for smooth curves
      collarGeometry = new THREE.ShapeGeometry(ruffleCollarShape, 24);
      break;

    case "crop-top":
      // Wide, shallow neckline
      const neckShape = new THREE.Shape();
      const neckWidth = 0.7 * measurements.bust;
      const neckDepth = 0.2 * measurements.bust;

      // Create a smooth curve for the neck
      neckShape.moveTo(-neckWidth, 0);
      neckShape.bezierCurveTo(
        -neckWidth / 2,
        -neckDepth * 0.8,
        neckWidth / 2,
        -neckDepth * 0.8,
        neckWidth,
        0
      );

      // Create outer edge
      neckShape.lineTo(neckWidth * 1.2, 0.1);
      neckShape.bezierCurveTo(
        (neckWidth / 2) * 1.2,
        -neckDepth * 0.9,
        (-neckWidth / 2) * 1.2,
        -neckDepth * 0.9,
        -neckWidth * 1.2,
        0.1
      );
      neckShape.lineTo(-neckWidth, 0);

      collarGeometry = new THREE.ShapeGeometry(neckShape, 24);
      break;

    default:
      // Standard blouse collar with gentle curve
      const standardCollarShape = new THREE.Shape();
      const collarWidth = 0.6 * measurements.bust;
      const collarDepth = 0.15 * measurements.bust;
      const collarHeight = 0.1;

      // Front center opening
      standardCollarShape.moveTo(-0.05, 0);
      standardCollarShape.lineTo(0.05, 0);

      // Right side of collar
      standardCollarShape.bezierCurveTo(
        collarWidth * 0.3,
        -collarHeight * 0.5,
        collarWidth * 0.7,
        -collarHeight,
        collarWidth,
        -collarDepth
      );

      // Outer edge
      standardCollarShape.lineTo(collarWidth * 1.1, -collarDepth * 0.9);

      // Fold back
      standardCollarShape.bezierCurveTo(
        collarWidth * 0.7,
        -collarHeight * 1.5,
        collarWidth * 0.3,
        -collarHeight * 2,
        0,
        -collarHeight * 1.8
      );

      // Left side - mirrored
      standardCollarShape.bezierCurveTo(
        -collarWidth * 0.3,
        -collarHeight * 2,
        -collarWidth * 0.7,
        -collarHeight * 1.5,
        -collarWidth * 1.1,
        -collarDepth * 0.9
      );

      standardCollarShape.lineTo(-collarWidth, -collarDepth);

      standardCollarShape.bezierCurveTo(
        -collarWidth * 0.7,
        -collarHeight,
        -collarWidth * 0.3,
        -collarHeight * 0.5,
        -0.05,
        0
      );

      collarGeometry = new THREE.ExtrudeGeometry(standardCollarShape, {
        steps: 1,
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      });
  }

  const collar = new THREE.Mesh(collarGeometry, material);

  // Position and orientation based on style
  switch (style) {
    case "ruffle":
      collar.position.set(0, measurements.shoulderWidth, 0.25);
      collar.rotation.x = -Math.PI * 0.1;
      break;

    case "crop-top":
      collar.position.set(0, measurements.shoulderWidth, 0.25);
      collar.rotation.x = -Math.PI / 2;
      collar.rotation.z = Math.PI;
      break;

    default:
      collar.position.set(0, measurements.shoulderWidth, 0.25);
      // Continuing from where the code was cut off
      collar.rotation.x = -Math.PI * 0.3;
  }

  collar.name = "collar";
  collar.castShadow = true;
  collar.receiveShadow = true;

  return collar;
};

// Helper function to create closures (buttons, zippers, etc.)
const createClosures = (style, material, measurements) => {
  const closuresGroup = new THREE.Group();

  switch (style) {
    case "crop-top":
      // No visible closures for crop top
      break;

    case "ruffle":
      // Add decorative buttons
      const buttonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16);
      const buttonMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.3,
        metalness: 0.2,
      });

      // Create a row of decorative buttons
      for (let i = 0; i < 5; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0, measurements.shoulderWidth - i * 0.25, 0.3);
        button.rotation.x = Math.PI / 2;
        button.name = `button-${i + 1}`;
        button.castShadow = true;
        closuresGroup.add(button);
      }
      break;

    default:
      // Standard buttoned closure
      const standardButtonGeometry = new THREE.CylinderGeometry(
        0.025,
        0.025,
        0.01,
        16
      );
      const standardButtonMaterial = new THREE.MeshStandardMaterial({
        color: 0xd0d0d0,
        roughness: 0.4,
        metalness: 0.1,
      });

      // Create a row of buttons for standard blouse
      const buttonCount = Math.floor(measurements.length / 0.3);
      for (let i = 0; i < buttonCount; i++) {
        const button = new THREE.Mesh(
          standardButtonGeometry,
          standardButtonMaterial
        );
        const yPos = measurements.shoulderWidth - i * 0.3 - 0.1;

        // Don't place buttons below the bottom of the blouse
        if (yPos < -measurements.length + 0.1) break;

        button.position.set(0, yPos, 0.3);
        button.rotation.x = Math.PI / 2;
        button.name = `button-${i + 1}`;
        button.castShadow = true;
        closuresGroup.add(button);
      }

      // Add buttonholes
      const buttonholeGeometry = new THREE.BoxGeometry(0.01, 0.04, 0.005);
      const buttonholeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
      });

      for (let i = 0; i < buttonCount; i++) {
        const yPos = measurements.shoulderWidth - i * 0.3 - 0.1;

        // Don't place buttonholes below the bottom of the blouse
        if (yPos < -measurements.length + 0.1) break;

        const buttonhole = new THREE.Mesh(
          buttonholeGeometry,
          buttonholeMaterial
        );
        buttonhole.position.set(0.05, yPos, 0.3);
        buttonhole.name = `buttonhole-${i + 1}`;
        closuresGroup.add(buttonhole);
      }
  }

  return closuresGroup;
};

// Helper function to create ruffles for the ruffle style
const createRuffles = (material, measurements) => {
  const rufflesGroup = new THREE.Group();

  // Create wavy geometry for ruffles
  // Bottom hem ruffle
  const bottomRuffleShape = new THREE.Shape();
  const ruffleWidth = measurements.hip * 1.4;
  const ruffleHeight = 0.2;
  const waveCount = 16;

  // Create wavy bottom edge with sine function
  bottomRuffleShape.moveTo(-ruffleWidth, 0);

  for (let i = 0; i <= waveCount; i++) {
    const x = -ruffleWidth + (i / waveCount) * (ruffleWidth * 2);
    const y = Math.sin(i * Math.PI) * ruffleHeight;

    if (i === 0) {
      bottomRuffleShape.lineTo(x, y);
    } else {
      const prevX = -ruffleWidth + ((i - 1) / waveCount) * (ruffleWidth * 2);
      const prevY = Math.sin((i - 1) * Math.PI) * ruffleHeight;

      const ctrlX1 = prevX + (x - prevX) * 0.25;
      const ctrlY1 = prevY + (y - prevY) * 0.1;
      const ctrlX2 = prevX + (x - prevX) * 0.75;
      const ctrlY2 = prevY + (y - prevY) * 0.9;

      bottomRuffleShape.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, x, y);
    }
  }

  // Complete the shape with a straight top edge
  bottomRuffleShape.lineTo(ruffleWidth, ruffleHeight);
  bottomRuffleShape.lineTo(-ruffleWidth, ruffleHeight);
  bottomRuffleShape.closePath();

  const bottomRuffleGeometry = new THREE.ShapeGeometry(bottomRuffleShape, 32);
  const bottomRuffle = new THREE.Mesh(bottomRuffleGeometry, material);
  bottomRuffle.position.set(0, -measurements.length - 0.05, 0);
  bottomRuffle.name = "bottom-ruffle";
  bottomRuffle.castShadow = true;
  bottomRuffle.receiveShadow = true;

  rufflesGroup.add(bottomRuffle);

  // Add sleeve ruffles
  const sleeveRuffleShape = new THREE.Shape();
  const sleeveRuffleRadius = 0.25 * measurements.shoulderWidth;
  const sleeveRuffleWidth = 0.15;

  // Create circular shape with wavy edge
  sleeveRuffleShape.absarc(0, 0, sleeveRuffleRadius, 0, Math.PI * 2, false);
  sleeveRuffleShape.absarc(
    0,
    0,
    sleeveRuffleRadius - sleeveRuffleWidth,
    0,
    Math.PI * 2,
    true
  );

  const sleeveRuffleGeometry = new THREE.ShapeGeometry(sleeveRuffleShape, 32);

  // Left sleeve ruffle
  const leftSleeveRuffle = new THREE.Mesh(sleeveRuffleGeometry, material);
  leftSleeveRuffle.position.set(
    -measurements.bust * 0.9,
    measurements.shoulderWidth * 0.8 - measurements.sleeveLength["ruffle"],
    0
  );
  leftSleeveRuffle.rotation.x = Math.PI / 2;
  leftSleeveRuffle.name = "left-sleeve-ruffle";
  leftSleeveRuffle.castShadow = true;

  // Right sleeve ruffle
  const rightSleeveRuffle = new THREE.Mesh(
    sleeveRuffleGeometry.clone(),
    material
  );
  rightSleeveRuffle.position.set(
    measurements.bust * 0.9,
    measurements.shoulderWidth * 0.8 - measurements.sleeveLength["ruffle"],
    0
  );
  rightSleeveRuffle.rotation.x = Math.PI / 2;
  rightSleeveRuffle.name = "right-sleeve-ruffle";
  rightSleeveRuffle.castShadow = true;

  rufflesGroup.add(leftSleeveRuffle);
  rufflesGroup.add(rightSleeveRuffle);

  return rufflesGroup;
};

// Helper function to create natural wrinkles and folds in the fabric
const createNaturalWrinkles = (style, material, measurements) => {
  const wrinklesGroup = new THREE.Group();

  // Different wrinkle patterns based on style and fabric type
  switch (style) {
    case "ruffle":
      // More pronounced wrinkles for ruffle style
      const ruffleWrinkleCount = 12;

      for (let i = 0; i < ruffleWrinkleCount; i++) {
        const angle = (i / ruffleWrinkleCount) * Math.PI * 2;
        const radius = measurements.waist * (0.7 + 0.1 * Math.random());
        const x = Math.cos(angle) * radius;
        const y = -measurements.length * 0.3 - 0.2 * Math.random();
        const z = Math.sin(angle) * radius * 0.5;

        // Create a subtle fold/wrinkle
        const wrinkleGeometry = new THREE.TorusGeometry(
          0.2,
          0.02,
          8,
          8,
          Math.PI * (0.2 + 0.3 * Math.random())
        );
        const wrinkle = new THREE.Mesh(wrinkleGeometry, material);

        wrinkle.position.set(x, y, z);
        wrinkle.rotation.x = Math.PI / 2;
        wrinkle.rotation.y = Math.random() * Math.PI;
        wrinkle.rotation.z = angle + Math.PI / 2;
        wrinkle.scale.set(1 + 0.5 * Math.random(), 1, 1 + 0.3 * Math.random());
        wrinkle.name = `ruffle-wrinkle-${i}`;

        wrinklesGroup.add(wrinkle);
      }
      break;

    case "crop-top":
      // Minimal wrinkles for fitted crop top
      const cropWrinkleCount = 4;

      for (let i = 0; i < cropWrinkleCount; i++) {
        const angle = (i / cropWrinkleCount) * Math.PI * 2;
        const radius = measurements.waist * (0.8 + 0.05 * Math.random());
        const x = Math.cos(angle) * radius;
        const y = -measurements.length * 0.3 * Math.random();
        const z = Math.sin(angle) * radius * 0.5;

        // Create a subtle fold/wrinkle
        const wrinkleGeometry = new THREE.TorusGeometry(
          0.1,
          0.01,
          6,
          6,
          Math.PI * (0.1 + 0.1 * Math.random())
        );
        const wrinkle = new THREE.Mesh(wrinkleGeometry, material);

        wrinkle.position.set(x, y, z);
        wrinkle.rotation.x = Math.PI / 2;
        wrinkle.rotation.y = Math.random() * Math.PI;
        wrinkle.rotation.z = angle + Math.PI / 2;
        wrinkle.name = `crop-wrinkle-${i}`;

        wrinklesGroup.add(wrinkle);
      }
      break;

    default:
      // Standard wrinkles for regular blouse
      const standardWrinkleCount = 8;

      for (let i = 0; i < standardWrinkleCount; i++) {
        const angle = (i / standardWrinkleCount) * Math.PI * 2;
        const radius = measurements.waist * (0.75 + 0.15 * Math.random());
        const heightVariation = [-0.3, -0.6, -0.8];
        const y =
          -measurements.length * heightVariation[i % heightVariation.length];
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.6;

        // Create a subtle fold/wrinkle
        const wrinkleGeometry = new THREE.TorusGeometry(
          0.15,
          0.015,
          8,
          8,
          Math.PI * (0.15 + 0.2 * Math.random())
        );
        const wrinkle = new THREE.Mesh(wrinkleGeometry, material);

        wrinkle.position.set(x, y, z);
        wrinkle.rotation.x = Math.PI / 2;
        wrinkle.rotation.y = Math.random() * Math.PI * 0.5;
        wrinkle.rotation.z = angle + Math.PI / 2;
        wrinkle.scale.set(1 + 0.3 * Math.random(), 1, 1 + 0.2 * Math.random());
        wrinkle.name = `standard-wrinkle-${i}`;

        wrinklesGroup.add(wrinkle);
      }
  }

  return wrinklesGroup;
};

// Helper function to create seams and stitching details
const createSeamsAndStitching = (style, material, measurements) => {
  const seamsGroup = new THREE.Group();

  // Create a lighter colored material for seams
  const seamMaterial = material.clone();
  seamMaterial.color.set(0xffffff);
  seamMaterial.opacity = 0.8;

  // Side seams
  const sideSeamGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(
        measurements.bust * 0.9,
        measurements.shoulderWidth * 0.7,
        0
      ),
      new THREE.Vector3(measurements.waist * 0.8, 0, 0),
      new THREE.Vector3(measurements.hip * 0.9, -measurements.length, 0),
    ]),
    20,
    0.005,
    8,
    false
  );

  // Left side seam
  const leftSideSeam = new THREE.Mesh(sideSeamGeometry, seamMaterial);
  leftSideSeam.name = "left-side-seam";

  // Right side seam (mirror of left)
  const rightSideSeam = new THREE.Mesh(sideSeamGeometry, seamMaterial);
  rightSideSeam.scale.x = -1;
  rightSideSeam.name = "right-side-seam";

  seamsGroup.add(leftSideSeam);
  seamsGroup.add(rightSideSeam);

  // Center front stitching
  if (style !== "crop-top") {
    const centerSeamGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, measurements.shoulderWidth * 0.9, 0.25),
        new THREE.Vector3(0, 0, 0.2),
        new THREE.Vector3(0, -measurements.length, 0.1),
      ]),
      20,
      0.003,
      8,
      false
    );

    const centerSeam = new THREE.Mesh(centerSeamGeometry, seamMaterial);
    centerSeam.name = "center-seam";
    seamsGroup.add(centerSeam);
  }

  // Additional style-specific seams
  switch (style) {
    case "ruffle":
      // Add decorative seams for ruffle detail
      const ruffleSeamGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            -measurements.bust * 0.6,
            measurements.shoulderWidth * 0.4,
            0.15
          ),
          new THREE.Vector3(0, measurements.shoulderWidth * 0.35, 0.2),
          new THREE.Vector3(
            measurements.bust * 0.6,
            measurements.shoulderWidth * 0.4,
            0.15
          ),
        ]),
        20,
        0.004,
        8,
        false
      );

      const ruffleSeam = new THREE.Mesh(ruffleSeamGeometry, seamMaterial);
      ruffleSeam.name = "ruffle-seam";
      seamsGroup.add(ruffleSeam);
      break;

    case "crop-top":
      // Add hem stitching for crop top
      const cropHemGeometry = new THREE.TorusGeometry(
        measurements.waist * 1.0,
        0.006,
        8,
        36,
        Math.PI * 2
      );
      const cropHem = new THREE.Mesh(cropHemGeometry, seamMaterial);
      cropHem.position.set(0, -0.2, 0);
      cropHem.rotation.x = Math.PI / 2;
      cropHem.name = "crop-hem";
      seamsGroup.add(cropHem);
      break;

    default:
      // Add standard hem stitching
      const hemGeometry = new THREE.TorusGeometry(
        measurements.hip * 1.1,
        0.006,
        8,
        36,
        Math.PI * 2
      );
      const hem = new THREE.Mesh(hemGeometry, seamMaterial);
      hem.position.set(0, -measurements.length, 0);
      hem.rotation.x = Math.PI / 2;
      hem.name = "hem-stitch";
      seamsGroup.add(hem);
  }

  return seamsGroup;
};

// Helper function to determine fabric roughness
const getFabricRoughness = (fabric) => {
  const roughnessValues = {
    silk: 0.2,
    cotton: 0.7,
    denim: 0.9,
    linen: 0.8,
    leather: 0.6,
    wool: 0.85,
    chiffon: 0.4,
  };

  return roughnessValues[fabric] || 0.5;
};

// Helper function to determine fabric metalness
const getFabricMetalness = (fabric) => {
  const metalnessValues = {
    silk: 0.1,
    cotton: 0.0,
    denim: 0.0,
    linen: 0.0,
    leather: 0.05,
    wool: 0.0,
    chiffon: 0.05,
  };

  return metalnessValues[fabric] || 0.0;
};

// Helper function to determine if fabric is transparent
const isTransparent = (fabric) => {
  return ["chiffon"].includes(fabric);
};

// Helper function to determine fabric opacity
const getFabricOpacity = (fabric) => {
  const opacityValues = {
    chiffon: 0.7,
    silk: 0.95,
  };

  return opacityValues[fabric] || 1.0;
};

export default BlouseModel;
