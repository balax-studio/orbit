import * as THREE from 'three';

// Reference cues: three character portraits and the blocky role roster in
// referans_gorseller/. These meshes are presentation-only; simulation state
// stays in the domain and application layers.

export type CharacterRole = 'player' | 'worker' | 'customer';

export interface ArticulatedCharacter {
  readonly root: THREE.Group;
  setPosition(x: number, z: number): void;
  setFacing(rotation: number): void;
  advance(deltaSeconds: number): void;
  dispose(): void;
}

interface RigParts {
  readonly leftArm: THREE.Group;
  readonly rightArm: THREE.Group;
  readonly leftLeg: THREE.Group;
  readonly rightLeg: THREE.Group;
  readonly head: THREE.Group;
}

interface CharacterPalette {
  readonly skin: THREE.Material;
  readonly hair: THREE.Material;
  readonly hairHighlight: THREE.Material;
  readonly dark: THREE.Material;
  readonly blouse: THREE.Material;
  readonly lilac: THREE.Material;
  readonly skirt: THREE.Material;
  readonly shirt: THREE.Material;
  readonly apron: THREE.Material;
  readonly rust: THREE.Material;
  readonly cream: THREE.Material;
  readonly gray: THREE.Material;
  readonly straw: THREE.Material;
  readonly eyeWhite: THREE.Material;
  readonly pupil: THREE.Material;
  readonly tray: THREE.Material;
  readonly drinkOne: THREE.Material;
  readonly drinkTwo: THREE.Material;
  readonly drinkThree: THREE.Material;
}

const palette = (role: CharacterRole): CharacterPalette => {
  const colors = {
    player: {
      blouse: '#F2EFE7', lilac: '#AF83C3', skirt: '#57433D', shirt: '#F2EFE7',
      apron: '#57433D', rust: '#B85E47', cream: '#EAC39B', hair: '#654536',
      hairHighlight: '#80604A', gray: '#A29D91', straw: '#D9AC58', tray: '#75584A',
    },
    worker: {
      blouse: '#EEECE4', lilac: '#AF83C3', skirt: '#57433D', shirt: '#6879B6',
      apron: '#59453F', rust: '#C66E50', cream: '#EAC39B', hair: '#684733',
      hairHighlight: '#866045', gray: '#A29D91', straw: '#D9AC58', tray: '#765A4C',
    },
    customer: {
      blouse: '#EEECE4', lilac: '#AF83C3', skirt: '#57433D', shirt: '#E4BD69',
      apron: '#59453F', rust: '#B85D47', cream: '#EAC39B', hair: '#81796E',
      hairHighlight: '#A29D91', gray: '#A29D91', straw: '#E1B65F', tray: '#765A4C',
    },
  }[role];

  const mat = (color: string): THREE.Material => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.84,
    flatShading: true,
  });

  return {
    skin: mat(colors.cream),
    hair: mat(colors.hair),
    hairHighlight: mat(colors.hairHighlight),
    dark: mat('#453733'),
    blouse: mat(colors.blouse),
    lilac: mat(colors.lilac),
    skirt: mat(colors.skirt),
    shirt: mat(colors.shirt),
    apron: mat(colors.apron),
    rust: mat(colors.rust),
    cream: mat(colors.cream),
    gray: mat(colors.gray),
    straw: mat(colors.straw),
    eyeWhite: mat('#F7F0E2'),
    pupil: mat('#594239'),
    tray: mat(colors.tray),
    drinkOne: mat('#C9794F'),
    drinkTwo: mat('#74A98C'),
    drinkThree: mat('#D4A951'),
  };
};

function addMesh<TGeometry extends THREE.BufferGeometry>(
  parent: THREE.Object3D,
  geometry: TGeometry,
  material: THREE.Material,
  position: THREE.Vector3Tuple,
): THREE.Mesh<TGeometry, THREE.Material> {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addBox(
  parent: THREE.Object3D,
  size: THREE.Vector3Tuple,
  position: THREE.Vector3Tuple,
  material: THREE.Material,
): THREE.Mesh<THREE.BoxGeometry, THREE.Material> {
  return addMesh(parent, new THREE.BoxGeometry(...size), material, position);
}

function makeHead(role: CharacterRole, root: THREE.Group, colors: CharacterPalette): THREE.Group {
  const head = new THREE.Group();
  head.position.y = 1.48;
  root.add(head);

  addMesh(head, new THREE.DodecahedronGeometry(0.32, 0), colors.skin, [0, 0, 0]);
  const face = addBox(head, [0.43, 0.43, 0.18], [0, -0.025, 0.16], colors.skin);
  face.scale.set(1, 1, 0.8);

  if (role === 'player') {
    addMesh(head, new THREE.DodecahedronGeometry(0.35, 0), colors.hair, [0, 0.16, -0.055]);
    addBox(head, [0.49, 0.14, 0.17], [-0.025, 0.12, 0.16], colors.hairHighlight);
    addBox(head, [0.16, 0.42, 0.18], [-0.25, -0.04, 0.015], colors.hair);
    addBox(head, [0.16, 0.42, 0.18], [0.25, -0.04, 0.015], colors.hair);
    addBox(head, [0.19, 0.13, 0.10], [-0.10, 0.15, 0.22], colors.hair);
  } else if (role === 'worker') {
    addMesh(head, new THREE.DodecahedronGeometry(0.34, 0), colors.hair, [0, 0.15, -0.06]);
    addBox(head, [0.47, 0.12, 0.20], [-0.015, 0.11, 0.15], colors.hairHighlight);
    addBox(head, [0.13, 0.30, 0.17], [-0.25, 0.005, 0.025], colors.hair);
    addBox(head, [0.26, 0.13, 0.10], [0.11, 0.14, 0.20], colors.hair);
  } else {
    addBox(head, [0.13, 0.29, 0.18], [-0.25, 0.035, -0.015], colors.gray);
    addBox(head, [0.13, 0.29, 0.18], [0.25, 0.035, -0.015], colors.gray);
    addMesh(head, new THREE.DodecahedronGeometry(0.22, 0), colors.gray, [0, -0.205, 0.13]);
    addBox(head, [0.20, 0.055, 0.035], [-0.12, 0.005, 0.225], colors.dark);
    addBox(head, [0.20, 0.055, 0.035], [0.12, 0.005, 0.225], colors.dark);
    addBox(head, [0.055, 0.035, 0.04], [0, 0.005, 0.23], colors.dark);
    addMesh(head, new THREE.CylinderGeometry(0.43, 0.43, 0.07, 8), colors.straw, [0, 0.35, -0.04]);
    addMesh(head, new THREE.CylinderGeometry(0.32, 0.32, 0.05, 8), colors.dark, [0, 0.405, -0.04]);
    addMesh(head, new THREE.ConeGeometry(0.31, 0.24, 7), colors.straw, [0, 0.53, -0.04]);
  }

  // Simple friendly face details sit toward the character's forward (+Z) side.
  for (const x of [-0.115, 0.115]) {
    addBox(head, [0.09, 0.065, 0.035], [x, -0.045, 0.245], colors.eyeWhite);
    addBox(head, [0.035, 0.045, 0.025], [x, -0.045, 0.269], colors.pupil);
    addBox(head, [0.11, 0.035, 0.04], [x, 0.035, 0.245], colors.hairHighlight);
  }
  addBox(head, [0.055, 0.08, 0.06], [0, -0.125, 0.235], colors.skin);
  if (role !== 'customer') addBox(head, [0.11, 0.035, 0.025], [0, -0.20, 0.22], colors.dark);
  if (role === 'worker') addBox(head, [0.17, 0.045, 0.035], [0, -0.20, 0.24], colors.rust);

  return head;
}

function makeArm(
  root: THREE.Group,
  x: number,
  sleeve: THREE.Material,
  skin: THREE.Material,
): THREE.Group {
  const arm = new THREE.Group();
  arm.name = x < 0 ? 'arm.left' : 'arm.right';
  arm.position.set(x, 1.21, 0);
  root.add(arm);
  addBox(arm, [0.21, 0.33, 0.22], [0, -0.16, 0], sleeve);
  addBox(arm, [0.16, 0.24, 0.17], [0, -0.40, 0.035], skin);
  addBox(arm, [0.16, 0.13, 0.18], [0, -0.55, 0.08], skin);
  return arm;
}

function makeLeg(
  root: THREE.Group,
  x: number,
  pants: THREE.Material,
  shoe: THREE.Material,
): THREE.Group {
  const leg = new THREE.Group();
  leg.name = x < 0 ? 'leg.left' : 'leg.right';
  leg.position.set(x, 0.68, 0);
  root.add(leg);
  addBox(leg, [0.23, 0.57, 0.25], [0, -0.28, 0], pants);
  addBox(leg, [0.28, 0.14, 0.39], [0, -0.58, 0.065], shoe);
  return leg;
}

function addRoleClothing(role: CharacterRole, root: THREE.Group, colors: CharacterPalette): void {
  const torsoMaterial = role === 'player' ? colors.blouse : colors.shirt;
  addBox(root, [0.62, 0.63, 0.40], [0, 1.02, 0], torsoMaterial);

  if (role === 'player') {
    addMesh(root, new THREE.CylinderGeometry(0.27, 0.39, 0.38, 7), colors.skirt, [0, 0.68, 0]);
    addBox(root, [0.54, 0.12, 0.14], [0, 1.31, 0.02], colors.lilac);
    addBox(root, [0.14, 0.38, 0.095], [-0.13, 1.09, 0.22], colors.lilac);
    addBox(root, [0.15, 0.48, 0.095], [0.13, 0.99, 0.23], colors.lilac);
    addBox(root, [0.035, 0.29, 0.07], [0.34, 1.02, 0], colors.blouse);
  } else if (role === 'worker') {
    addBox(root, [0.42, 0.43, 0.055], [0, 0.82, 0.22], colors.apron);
    addBox(root, [0.18, 0.11, 0.035], [0, 0.82, 0.255], colors.rust);
    addBox(root, [0.50, 0.065, 0.055], [0, 0.61, 0.23], colors.apron);
  } else {
    addBox(root, [0.52, 0.16, 0.10], [0, 1.20, 0.20], colors.rust);
    addBox(root, [0.17, 0.34, 0.09], [0, 1.00, 0.23], colors.rust);
    addBox(root, [0.13, 0.14, 0.06], [0.24, 0.89, 0.23], colors.rust);
  }
}

export function createArticulatedCharacter(role: CharacterRole): ArticulatedCharacter {
  const root = new THREE.Group();
  const colors = palette(role);
  const pants = role === 'customer' ? colors.apron : colors.skirt;
  const shoe = role === 'customer' ? colors.dark : colors.tray;

  addRoleClothing(role, root, colors);
  const leftArm = makeArm(root, -0.36, role === 'player' ? colors.blouse : colors.shirt, colors.skin);
  const rightArm = makeArm(root, 0.36, role === 'player' ? colors.blouse : colors.shirt, colors.skin);
  const leftLeg = makeLeg(root, -0.16, pants, shoe);
  const rightLeg = makeLeg(root, 0.16, pants, shoe);
  const head = makeHead(role, root, colors);

  if (role === 'worker') {
    // Carried product visuals are attached by SceneRenderer from physical inventory.
    rightArm.rotation.z = 0;
  }

  const parts: RigParts = { leftArm, rightArm, leftLeg, rightLeg, head };
  let previous: { x: number; z: number } | null = null;
  let walkTimer = 0;
  let phase = 0;
  let facing = 0;

  return {
    root,
    setPosition(x, z) {
      if (previous) {
        const dx = x - previous.x;
        const dz = z - previous.z;
        if (dx * dx + dz * dz > 0.0000025) {
          walkTimer = 0.20;
          if (role !== 'player') facing = Math.atan2(dx, dz);
        }
      }
      previous = { x, z };
      root.position.x = x;
      root.position.z = z;
      if (role !== 'player') root.rotation.y = facing;
    },
    setFacing(rotation) {
      if (role === 'player') root.rotation.y = rotation;
    },
    advance(deltaSeconds) {
      const dt = Math.min(Math.max(deltaSeconds, 0), 0.05);
      walkTimer = Math.max(0, walkTimer - dt);
      const amount = Math.min(walkTimer / 0.12, 1);
      if (amount > 0) phase += dt * 10.5;
      const stride = Math.sin(phase) * 0.58 * amount;
      parts.leftLeg.rotation.x = stride;
      parts.rightLeg.rotation.x = -stride;
      parts.leftArm.rotation.x = -stride * 0.62;
      if (role !== 'worker') parts.rightArm.rotation.x = stride * 0.62;
      else parts.rightArm.rotation.y = Math.sin(phase) * 0.025 * amount;
      root.position.y = Math.abs(Math.sin(phase * 2)) * 0.035 * amount;
      parts.head.rotation.z = Math.sin(phase) * 0.025 * amount;
    },
    dispose() {
      root.removeFromParent();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      root.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          materials.add(material);
        }
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
