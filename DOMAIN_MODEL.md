# Domain Model & Game Economy

This document acts as the definitive source of truth for the game's data.

## 1. Item Dictionary (24 Items)
All items in the game have an `id`, `name`, `type` (raw, intermediate, final), and `baseValue`.

**Raw Materials (Hammaddeler):**
- `iron_ore` (Demir Cevheri) - Value: 10
- `copper_ore` (Bakır Cevheri) - Value: 12
- `silicon` (Silikon) - Value: 15
- `water` (Su) - Value: 5
- `biomass` (Biyokütle) - Value: 8

*(Full list to be expanded based on OYUN_GELISTIRME_DEVIR_DOSYASI.md)*

## 2. Machine Dictionary
Machines process inputs into outputs based on time.

| ID | Name | Inputs | Outputs | Base Processing Time | Cost to Buy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `machine_melter` | Melter (Eritici) | 1x Ore | 1x Ingot | 2 seconds | 100 🪙 |
| `machine_assembler`| Assembler (Montaj) | 2x Components | 1x Product | 5 seconds | 500 🪙 |
| `machine_packer` | Packer (Paketleyici)| 1x Product | 1x Boxed | 1 second | 300 🪙 |

## 3. Recipes (Tarifler)
A recipe links inputs to outputs.

- **Iron Ingot Recipe**: 
  - Input: `1x iron_ore`
  - Output: `1x iron_ingot`
  - Required Machine: `machine_melter`
  - Time: `2000ms`

## 4. Characters
- **Player**: Has position `(x, y, z)`. Can move. Has an inventory array.
- **Customers**: Spawn at the edge of the map, queue at the Counter. Have a `desiredItem` and `patienceTimeout`.

## 5. Game Loop Constants
- Customer spawn rate: Every `15,000ms` (adjusted by store reputation).
- Customer patience: `45,000ms` before they leave angrily.
