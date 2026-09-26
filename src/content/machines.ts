export interface MachineDefinition {
  id: string;
  name: string;
  type: string;
  baseCost: number;
  powerConsumption: number; // Idle power
}

export const MACHINES: Record<string, MachineDefinition> = {
  'machine.packer': {
    id: 'machine.packer',
    name: 'Paketleyici',
    type: 'packer',
    baseCost: 150,
    powerConsumption: 1,
  },
  'machine.melter': {
    id: 'machine.melter',
    name: 'Eritici',
    type: 'melter',
    baseCost: 200,
    powerConsumption: 2,
  },
  'machine.biogrower': {
    id: 'machine.biogrower',
    name: 'Biyoyetiştirici',
    type: 'biogrower',
    baseCost: 300,
    powerConsumption: 3,
  }
};

export function getMachine(id: string): MachineDefinition {
  const machine = MACHINES[id];
  if (!machine) throw new Error(`Machine not found: ${id}`);
  return machine;
}
