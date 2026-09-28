import * as THREE from 'three';
import type { WorldFixture } from './WorldLayout';

// All coordinates are local metres. The fixture footprint remains the authority for collision.
const material = (color: string, metalness = 0) => new THREE.MeshStandardMaterial({
  color, metalness, roughness: metalness ? 0.48 : 0.86, flatShading: true,
});

function box(root: THREE.Group, size: [number, number, number], at: [number, number, number], color: string,
  metalness = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, metalness));
  mesh.position.set(...at);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function cylinder(root: THREE.Group, radius: number, height: number, at: [number, number, number],
  color: string, sides = 8): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, sides), material(color));
  mesh.position.set(...at);
  mesh.castShadow = true;
  root.add(mesh);
  return mesh;
}

function fountain(width: number, depth: number): THREE.Group {
  const root = new THREE.Group();
  box(root, [width * 0.84, 0.20, depth * 0.84], [0, 0.10, 0], '#C8BDA8');
  cylinder(root, 0.61, 0.18, [0, 0.27, 0], '#A6B8B4', 12);
  cylinder(root, 0.48, 0.025, [0, 0.37, 0], '#63B9C4', 12);
  box(root, [0.16, 1.03, 0.17], [-0.35, 0.76, -0.34], '#789693', 0.4);
  box(root, [0.57, 0.15, 0.18], [-0.12, 1.23, -0.34], '#789693', 0.4);
  cylinder(root, 0.09, 0.18, [0.15, 1.10, -0.34], '#789693');
  cylinder(root, 0.19, 0.09, [-0.35, 1.32, -0.34], '#DAB963');
  box(root, [0.43, 0.12, 0.28], [0.40, 0.56, 0.38], '#D6B784');
  return root;
}

function tomatoBed(width: number, depth: number): THREE.Group {
  const root = new THREE.Group();
  box(root, [width * 0.91, 0.20, depth * 0.91], [0, 0.11, 0], '#A87048');
  box(root, [width * 0.80, 0.05, depth * 0.80], [0, 0.23, 0], '#573A2C');
  const count = 9;
  const stems = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.028, 0.04, 0.48, 5),
    material('#477C48'), count);
  const leaves = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.16, 0), material('#659A52'), count);
  const fruit = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.105, 0), material('#D45B42'), count * 2);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i += 1) {
    const x = (i % 3 - 1) * width * 0.27;
    const z = (Math.floor(i / 3) - 1) * depth * 0.27;
    dummy.position.set(x, 0.49, z); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); stems.setMatrixAt(i, dummy.matrix);
    dummy.position.set(x, 0.73, z); dummy.updateMatrix(); leaves.setMatrixAt(i, dummy.matrix);
    for (let j = 0; j < 2; j += 1) {
      dummy.position.set(x + (j ? 0.13 : -0.13), 0.63 - j * 0.08, z + (j ? -0.08 : 0.08));
      dummy.updateMatrix(); fruit.setMatrixAt(i * 2 + j, dummy.matrix);
    }
  }
  stems.castShadow = leaves.castShadow = fruit.castShadow = true;
  fruit.name = 'ripe-fruit';
  fruit.visible = false;
  root.add(stems, leaves, fruit);
  return root;
}

function bottler(width: number, depth: number): THREE.Group {
  const root = new THREE.Group();
  const w = width * 0.86;
  const d = depth * 0.88;
  box(root, [w, 0.12, d], [0, 0.81, 0], '#C8D1C8', 0.55);
  for (const x of [-w * 0.4, w * 0.4]) for (const z of [-d * 0.40, d * 0.40]) {
    box(root, [0.08, 0.73, 0.08], [x, 0.39, z], '#6F8589', 0.55);
  }
  box(root, [w * 0.72, 0.62, d * 0.25], [0, 1.18, -d * 0.27], '#6CA9AA', 0.25);
  box(root, [w * 0.63, 0.16, d * 0.17], [0, 1.49, -d * 0.26], '#D4B669');
  box(root, [w * 0.17, 0.13, d * 0.13], [0, 1.27, -d * 0.13], '#4A6871');
  for (const z of [-0.40, 0, 0.40]) {
    cylinder(root, 0.025, 0.28, [0, 1.06, z], '#718D91');
  }
  box(root, [w * 0.7, 0.04, d * 0.31], [0, 0.9, d * 0.24], '#B7C9C7');
  return root;
}

function shelf(width: number, depth: number): THREE.Group {
  const root = new THREE.Group();
  const w = width * 0.92;
  const d = depth * 0.94;
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) {
    box(root, [0.055, 1.88, 0.055], [x, 0.94, z], '#929C9A', 0.35);
  }
  for (const y of [0.18, 0.60, 1.02, 1.44, 1.85]) {
    box(root, [w, 0.065, d], [0, y, 0], '#E6DFD2');
    box(root, [0.025, 0.055, d], [w / 2 + 0.012, y + 0.045, 0], '#7B9B94');
  }
  box(root, [0.04, 1.67, d], [-w / 2, 1.00, 0], '#D0D6CC');
  return root;
}

function checkout(width: number, depth: number): THREE.Group {
  const root = new THREE.Group();
  const w = width * 0.93;
  const d = depth * 0.90;
  box(root, [w, 0.75, d], [0, 0.39, 0], '#B74D48');
  box(root, [w + 0.05, 0.10, d + 0.05], [0, 0.82, 0], '#E7E1D4');
  box(root, [w * 0.68, 0.025, d * 0.52], [0, 0.89, -d * 0.15], '#5C6260');
  box(root, [w * 0.45, 0.22, d * 0.18], [0, 0.99, d * 0.28], '#D9D3C6');
  box(root, [w * 0.37, 0.28, 0.045], [0, 1.27, d * 0.28], '#465A5B');
  box(root, [0.025, 0.23, 0.025], [w * 0.30, 1.05, d * 0.16], '#394B4F');
  return root;
}

export function createFixtureAsset(fixture: WorldFixture): THREE.Group {
  const width = fixture.bounds.maxX - fixture.bounds.minX;
  const depth = fixture.bounds.maxZ - fixture.bounds.minZ;
  const root = fixture.id === 'source.spring_water' ? fountain(width, depth)
    : fixture.id === 'source.crop_plot' ? tomatoBed(width, depth)
      : fixture.id === 'station.bottler' ? bottler(width, depth)
        : fixture.id === 'fixture.sales_shelf' ? shelf(width, depth)
          : fixture.id === 'fixture.checkout' ? checkout(width, depth)
            : new THREE.Group();
  if (root.children.length === 0) {
    box(root, [width * 0.85, 0.85, depth * 0.85], [0, 0.425, 0], fixture.color);
    box(root, [width * 0.9, 0.07, depth * 0.9], [0, 0.89, 0], '#E7E1D4');
  }
  root.name = fixture.id;
  return root;
}

export function createProductAsset(itemId: string): THREE.Group {
  const root = new THREE.Group();
  const has = (...values: string[]) => values.includes(itemId);
  const bottle = (color: string, radius = 0.065, height = 0.26) => {
    cylinder(root, radius, height, [0, height / 2 + 0.03, 0], color);
    cylinder(root, radius * 0.56, 0.07, [0, height + 0.06, 0], color);
    cylinder(root, radius * 0.65, 0.025, [0, height + 0.105, 0], '#465963');
    box(root, [radius * 1.8, 0.065, 0.013], [0, height * 0.58, radius], '#EDE9D9');
  };
  const pouch = (color: string) => {
    box(root, [0.18, 0.22, 0.11], [0, 0.14, 0], color);
    box(root, [0.19, 0.035, 0.12], [0, 0.27, 0], '#E2C9A2');
  };
  if (has('item.heirloom_tomato', 'item.fresh_olives', 'item.walnut')) {
    const color = itemId.endsWith('tomato') ? '#D45942'
      : itemId.endsWith('walnut') ? '#9E764C' : '#728B4B';
    for (const x of [-0.11, 0, 0.11]) {
      cylinder(root, 0.088, 0.16, [x, 0.13, x === 0 ? 0.06 : -0.03], color, 7);
      cylinder(root, 0.03, 0.02, [x, 0.22, x === 0 ? 0.06 : -0.03], '#4C8449', 5);
    }
  } else if (has('item.local_cucumber', 'item.village_pepper', 'item.sweet_corn')) {
    const color = itemId.endsWith('corn') ? '#E3B94D' : '#518153';
    for (const x of [-0.08, 0.08]) {
      const vegetable = cylinder(root, itemId.endsWith('pepper') ? 0.038 : 0.06,
        itemId.endsWith('corn') ? 0.33 : 0.28, [x, 0.14, 0], color, 7);
      vegetable.rotation.z = Math.PI / 2;
    }
  } else if (has('item.black_grapes', 'item.raisins')) {
    for (let i = 0; i < 7; i += 1) cylinder(root, 0.042, 0.075,
      [(i % 3 - 1) * 0.075, 0.12 + Math.floor(i / 3) * 0.07, 0], '#765374', 6);
    box(root, [0.02, 0.11, 0.02], [0, 0.3, 0], '#718854');
  } else if (has('item.einkorn_wheat', 'item.aegean_cotton', 'item.sunflower', 'item.lake_reeds')) {
    for (const x of [-0.075, 0, 0.075]) {
      box(root, [0.025, 0.29, 0.025], [x, 0.17, 0], '#9D9C58');
      cylinder(root, itemId.endsWith('sunflower') ? 0.13 : 0.045, 0.10,
        [x, 0.34, 0], itemId.endsWith('cotton') ? '#E5E7DE' : '#D6B45D', 8);
    }
  } else if (has('item.water_carboy_19l', 'item.carboy_19l_empty')) {
    cylinder(root, 0.17, 0.42, [0, 0.24, 0], '#80BFD4', 10);
    cylinder(root, 0.075, 0.11, [0, 0.51, 0], '#80BFD4');
    cylinder(root, 0.083, 0.038, [0, 0.59, 0], '#3F8BB3');
  } else if (has('item.water_jug_5l', 'item.jug_5l_empty')) {
    box(root, [0.27, 0.36, 0.22], [0, 0.21, 0], '#A4D4D8');
    cylinder(root, 0.048, 0.036, [-0.07, 0.41, 0], '#3E92AF');
    box(root, [0.06, 0.11, 0.05], [0.15, 0.32, 0], '#A4D4D8');
  } else if (has('item.raw_water')) {
    cylinder(root, 0.11, 0.20, [0, 0.14, 0], '#64ABC3');
    cylinder(root, 0.118, 0.035, [0, 0.25, 0], '#A9DCE3');
  } else if (has('item.glass_water_small', 'item.small_bottle', 'item.fresh_lemonade',
    'item.sunflower_oil', 'item.extra_virgin_olive_oil', 'item.vinegar')) {
    bottle(itemId.includes('oil') ? '#C9B05B' : itemId.endsWith('vinegar') ? '#987349'
      : itemId.endsWith('lemonade') ? '#D5CB71' : '#A3CEDA');
  } else if (has('item.fresh_milk', 'item.goat_milk', 'item.churned_ayran')) {
    box(root, [0.16, 0.27, 0.14], [0, 0.16, 0], '#ECEBE0');
    box(root, [0.09, 0.055, 0.14], [0, 0.32, 0], '#9AC0D0');
    box(root, [0.10, 0.09, 0.015], [0, 0.17, 0.077], '#74A6BA');
  } else if (has('item.brewed_tea', 'item.mortar_coffee', 'item.mountain_salep', 'item.tarhana_soup')) {
    cylinder(root, itemId.endsWith('coffee') ? 0.10 : 0.085, 0.18,
      [0, 0.14, 0], itemId.endsWith('tea') ? '#B78150' : '#E1C8A0');
    cylinder(root, 0.09, 0.025, [0, 0.24, 0], '#F0E8D6');
    box(root, [0.07, 0.09, 0.035], [0.12, 0.16, 0], '#B4A486');
  } else if (has('item.sourdough_bread', 'item.baked_pastry', 'item.sucuk_pide', 'item.roasted_corn')) {
    const loaf = new THREE.Mesh(new THREE.SphereGeometry(0.17, 7, 5), material('#C89353'));
    loaf.scale.set(1.25, 0.55, itemId.endsWith('pide') ? 1.6 : 1);
    loaf.position.y = 0.13;
    root.add(loaf);
  } else if (has('item.farm_egg')) {
    box(root, [0.34, 0.07, 0.25], [0, 0.05, 0], '#B9A37B');
    for (const x of [-0.10, 0, 0.10]) cylinder(root, 0.045, 0.13, [x, 0.13, 0], '#EADCC0', 7);
  } else if (has('item.fresh_trout', 'item.smoked_trout')) {
    const fish = cylinder(root, 0.09, 0.33, [0, 0.15, 0], '#7D9B9A', 8);
    fish.rotation.z = Math.PI / 2;
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.15, 3), material('#647E7D'));
    tail.rotation.z = Math.PI / 2;
    tail.position.set(-0.22, 0.15, 0);
    root.add(tail);
  } else if (has('item.raw_meat', 'item.cured_pastirma')) {
    box(root, [0.32, 0.075, 0.25], [0, 0.04, 0], '#E1D8C7');
    for (const x of [-0.07, 0.07]) box(root, [0.11, 0.11, 0.18], [x, 0.14, 0], '#AC5D56');
  } else if (has('item.aged_cheese', 'item.farm_butter')) {
    box(root, [0.28, 0.12, 0.2], [0, 0.1, 0], itemId.endsWith('butter') ? '#E9C77F' : '#EAD696');
    box(root, [0.29, 0.035, 0.21], [0, 0.17, 0], '#F1E8C7');
  } else if (has('item.woven_basket', 'item.insulated_bag')) {
    box(root, [0.28, 0.22, 0.22], [0, 0.15, 0], '#9D7954');
    for (const x of [-0.11, 0.11]) box(root, [0.025, 0.21, 0.025], [x, 0.35, 0], '#77553E');
    box(root, [0.25, 0.03, 0.025], [0, 0.45, 0], '#77553E');
  } else if (has('item.woven_fabric', 'item.waxed_canvas', 'item.wool_shawl', 'item.raw_wool')) {
    cylinder(root, 0.105, 0.28, [0, 0.13, 0], '#A99B81', 8).rotation.z = Math.PI / 2;
    box(root, [0.24, 0.025, 0.14], [0, 0.23, 0], '#C4B6A0');
  } else if (has('item.einkorn_flour', 'item.lake_salt', 'item.salt', 'item.tea_leaf',
    'item.coffee_bean', 'item.yeast', 'item.spice_bundle', 'item.tomato_seed', 'item.fodder')) {
    pouch(itemId.endsWith('salt') ? '#E8E4DB' : '#B89A74');
  } else if (has('item.comb_honey', 'item.jarred_pickle', 'item.cured_olives',
    'item.village_tomato_paste', 'item.marinated_sun_tomatoes', 'item.grape_molasses',
    'item.tomato_puree', 'item.jar', 'item.natural_beeswax')) {
    cylinder(root, 0.105, 0.23, [0, 0.145, 0],
      itemId.includes('tomato') ? '#B95C4C' : '#B5915B', 8);
    cylinder(root, 0.115, 0.035, [0, 0.28, 0], '#5F6260', 8);
  } else if (has('item.village_breakfast', 'item.canned_menemen', 'item.pot_confit',
    'item.smoked_fish_wrap', 'item.pastirma_wrap')) {
    box(root, [0.32, 0.06, 0.25], [0, 0.06, 0], '#E5DED0');
    cylinder(root, 0.10, 0.10, [0, 0.13, 0], '#BA8B5C');
  } else {
    // Unknown content remains an unbranded parcel, never an invented sellable SKU.
    box(root, [0.20, 0.23, 0.17], [0, 0.14, 0], '#B99D77');
  }
  root.name = itemId;
  return root;
}

export function createCarriedAsset(itemId: string): THREE.Group {
  const root = new THREE.Group();
  box(root, [0.48, 0.21, 0.33], [0, 0.12, 0], '#B78654');
  box(root, [0.49, 0.04, 0.34], [0, 0.23, 0], '#D2A36D');
  for (const x of [-0.12, 0.12]) {
    const product = createProductAsset(itemId);
    product.position.set(x, 0.23, 0);
    product.scale.setScalar(0.72);
    root.add(product);
  }
  return root;
}

/** Preview-ready furniture kit. Placement and unlocks remain owned by WorldLayout/domain. */
export const FURNITURE_ASSET_IDS = [
  'shelf.single', 'shelf.double', 'shelf.corner', 'shelf.wall',
  'cooler.drinks', 'cooler.freezer', 'stand.produce', 'stand.bakery',
  'counter.meat', 'checkout.self', 'stand.baskets', 'cart.shopping',
  'storage.rack', 'storage.pallet', 'transport.pallet_jack',
  'production.conveyor', 'production.washer', 'production.packer',
  'farm.greenhouse', 'farm.water_tank',
] as const;

export type FurnitureAssetId = typeof FURNITURE_ASSET_IDS[number];

export function createFurnitureAsset(id: FurnitureAssetId): THREE.Group {
  const root = new THREE.Group();
  if (id.startsWith('shelf.')) {
    const addBay = (x: number, z: number, turn = 0) => {
      const bay = shelf(id === 'shelf.wall' ? 1.6 : 1.3, 0.55);
      bay.position.set(x, 0, z);
      bay.rotation.y = turn;
      root.add(bay);
    };
    addBay(0, 0);
    if (id === 'shelf.double') addBay(0, 0.65, Math.PI);
    if (id === 'shelf.corner') addBay(0.7, 0.6, Math.PI / 2);
    if (id === 'shelf.wall') box(root, [1.57, 1.66, 0.04], [0, 0.95, -0.29], '#D7DED8');
  } else if (id === 'cooler.drinks') {
    box(root, [1.65, 1.95, 0.68], [0, 0.98, 0], '#454E56', 0.45);
    for (const x of [-0.42, 0.42]) {
      box(root, [0.74, 1.7, 0.025], [x, 1.0, 0.36], '#9DC7D0', 0.1);
      box(root, [0.055, 1.57, 0.055], [x + 0.27, 1.0, 0.39], '#D9DED9', 0.5);
    }
    for (const y of [0.42, 0.84, 1.26, 1.68]) box(root, [1.42, 0.045, 0.45], [0, y, 0], '#B8C6CA');
  } else if (id === 'cooler.freezer') {
    box(root, [1.9, 0.94, 0.9], [0, 0.47, 0], '#EDF0E9');
    box(root, [1.78, 0.045, 0.76], [0, 0.96, 0], '#667E84');
    for (const x of [-0.44, 0.44]) box(root, [0.81, 0.025, 0.68], [x, 0.99, 0], '#A4C6CB');
  } else if (id === 'stand.produce' || id === 'stand.bakery') {
    box(root, [1.75, 0.52, 1.0], [0, 0.33, 0], '#99734F');
    for (const x of [-0.43, 0.43]) for (const z of [-0.22, 0.22]) {
      box(root, [0.72, 0.16, 0.36], [x, 0.68, z], '#B98D5E');
    }
    if (id === 'stand.bakery') box(root, [1.45, 0.06, 0.7], [0, 0.90, 0], '#E3C79D');
  } else if (id === 'counter.meat') {
    box(root, [2.2, 0.82, 0.85], [0, 0.43, 0], '#DCE2DC');
    box(root, [2.12, 0.07, 0.8], [0, 0.84, 0], '#9AB8BF');
    box(root, [2.0, 0.43, 0.028], [0, 1.05, 0.39], '#B6D3D5');
    box(root, [2.0, 0.07, 0.67], [0, 1.29, 0.06], '#E8E7DD');
  } else if (id === 'checkout.self') {
    box(root, [0.72, 0.88, 0.67], [0, 0.44, 0], '#555D61');
    box(root, [0.7, 0.08, 0.72], [0, 0.91, 0], '#DADFD8');
    box(root, [0.43, 0.5, 0.11], [0, 1.24, -0.23], '#394F55');
    box(root, [0.35, 0.31, 0.018], [0, 1.26, -0.16], '#83B9C7');
    box(root, [0.33, 0.23, 0.35], [0.5, 0.57, 0.04], '#9EB5A9');
  } else if (id === 'stand.baskets') {
    for (let i = 0; i < 5; i += 1) {
      box(root, [0.49, 0.06, 0.35], [0, 0.24 + i * 0.075, 0], '#C85046');
      for (const x of [-0.22, 0.22]) box(root, [0.025, 0.11, 0.32], [x, 0.30 + i * 0.075, 0], '#C85046');
    }
    for (const x of [-0.24, 0.24]) box(root, [0.03, 0.52, 0.03], [x, 0.26, -0.18], '#5C6462');
  } else if (id === 'cart.shopping') {
    box(root, [0.65, 0.3, 0.77], [0, 0.65, 0], '#A7B4B4', 0.6);
    box(root, [0.66, 0.04, 0.79], [0, 0.83, 0], '#657B7E', 0.6);
    for (const x of [-0.24, 0.24]) for (const z of [-0.29, 0.29]) {
      box(root, [0.035, 0.38, 0.035], [x, 0.35, z], '#657B7E', 0.6);
      cylinder(root, 0.072, 0.055, [x, 0.10, z], '#38434A');
    }
    box(root, [0.82, 0.055, 0.055], [0, 0.88, -0.43], '#C94E45');
  } else if (id === 'storage.rack') {
    for (const x of [-0.9, 0.9]) for (const z of [-0.39, 0.39])
      box(root, [0.075, 2.6, 0.075], [x, 1.3, z], '#306282', 0.5);
    for (const y of [0.22, 1.0, 1.78, 2.56]) box(root, [1.9, 0.09, 0.9], [0, y, 0], '#D28343');
  } else if (id === 'storage.pallet') {
    for (const x of [-0.43, 0, 0.43]) box(root, [0.16, 0.12, 1.1], [x, 0.07, 0], '#9D7146');
    for (const z of [-0.43, -0.14, 0.14, 0.43]) box(root, [1.15, 0.045, 0.16], [0, 0.15, z], '#B88855');
    for (const x of [-0.27, 0.27]) for (const z of [-0.24, 0.24])
      box(root, [0.47, 0.43, 0.42], [x, 0.40, z], '#C59B70');
  } else if (id === 'transport.pallet_jack') {
    for (const x of [-0.27, 0.27]) box(root, [0.12, 0.075, 1.15], [x, 0.09, 0.1], '#C79B36', 0.3);
    cylinder(root, 0.075, 0.12, [0, 0.17, -0.5], '#43494D');
    box(root, [0.055, 0.88, 0.055], [0, 0.61, -0.52], '#C79B36', 0.3);
    box(root, [0.36, 0.055, 0.055], [0, 1.04, -0.52], '#43494D');
  } else if (id === 'production.conveyor') {
    box(root, [0.92, 0.13, 1.9], [0, 0.73, 0], '#67787A', 0.45);
    box(root, [0.7, 0.035, 1.82], [0, 0.82, 0], '#41494B');
    for (const z of [-0.76, -0.38, 0, 0.38, 0.76])
      box(root, [0.68, 0.015, 0.027], [0, 0.845, z], '#B9C5BF');
    for (const x of [-0.36, 0.36]) for (const z of [-0.72, 0.72])
      box(root, [0.055, 0.66, 0.055], [x, 0.34, z], '#64777A');
  } else if (id === 'production.washer') {
    const conveyor = createFurnitureAsset('production.conveyor');
    root.add(conveyor);
    for (const x of [-0.4, 0.4]) box(root, [0.06, 0.68, 0.06], [x, 1.15, 0], '#89A8A8');
    box(root, [0.86, 0.07, 0.07], [0, 1.49, 0], '#89A8A8');
    for (const x of [-0.23, 0, 0.23]) cylinder(root, 0.035, 0.10, [x, 1.40, 0], '#6BABB8');
  } else if (id === 'production.packer') {
    box(root, [1.2, 0.84, 1.2], [0, 0.45, 0], '#B8C6C3', 0.4);
    box(root, [0.92, 0.09, 0.85], [0, 0.92, 0], '#5F777A');
    for (const x of [-0.47, 0.47]) box(root, [0.08, 0.72, 0.08], [x, 1.27, 0], '#657D7F');
    box(root, [1.03, 0.13, 0.12], [0, 1.67, 0], '#D0A457');
    box(root, [0.26, 0.28, 0.08], [0.34, 1.28, -0.52], '#46656A');
  } else if (id === 'farm.greenhouse') {
    for (const z of [-1.1, 0, 1.1]) {
      for (const x of [-0.8, 0.8]) box(root, [0.055, 1.23, 0.055], [x, 0.62, z], '#8CA5A1');
      box(root, [1.7, 0.055, 0.055], [0, 1.53, z], '#8CA5A1');
    }
    for (const x of [-0.8, 0.8]) box(root, [0.04, 0.52, 2.24], [x, 1.32, 0], '#A6C9BD');
    box(root, [1.58, 0.035, 2.2], [0, 1.57, 0], '#B4D8CB');
    for (const x of [-0.42, 0.42]) box(root, [0.55, 0.24, 1.9], [x, 0.15, 0], '#71543B');
  } else if (id === 'farm.water_tank') {
    cylinder(root, 0.56, 1.56, [0, 0.91, 0], '#5F95A6', 12);
    cylinder(root, 0.59, 0.09, [0, 1.74, 0], '#A9B6B3', 12);
    for (const x of [-0.39, 0.39]) for (const z of [-0.39, 0.39])
      box(root, [0.09, 0.25, 0.09], [x, 0.13, z], '#686C64');
    box(root, [0.09, 0.47, 0.09], [0.55, 0.52, 0], '#8DAEAB');
  }
  root.name = id;
  return root;
}
