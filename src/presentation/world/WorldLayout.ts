// Orbit Market - World Layout & Walkability Engine
// Reference: DUNYA_YERLESIM_PLANI.md §1-4, §9, §13

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface WorldFixture {
  id: string;
  name: string;
  bounds: BoundingBox2D;
  serviceCell: { x: number; z: number };
  color: string;
}

export class WorldLayout {
  // R3-C0 Satış Odası (6x6 metre): x: 12..17, z: 22..27
  public static readonly ROOM_BOUNDS: BoundingBox2D = {
    minX: 12,
    maxX: 17,
    minZ: 22,
    maxZ: 27,
  };

  public static readonly ROOM_CENTER = { x: 14.5, z: 24.5 };
  public static readonly PLAYER_SPAWN = { x: 14.5, z: 24.5 };

  // Market Güney Kapısı (x14..15, z27) ve dış eşik (x14..15, z28..29)
  public static readonly SOUTH_ENTRANCE: BoundingBox2D = {
    minX: 14,
    maxX: 15,
    minZ: 27,
    maxZ: 29,
  };

  // Batı Bahçe Geçiş Koridoru (x10..12, z24..25)
  public static readonly WEST_CORRIDOR: BoundingBox2D = {
    minX: 10,
    maxX: 12,
    minZ: 24,
    maxZ: 25,
  };

  // Batı Bahçe Bölgesi (x4..9, z20..27)
  public static readonly GARDEN_BOUNDS: BoundingBox2D = {
    minX: 4,
    maxX: 9,
    minZ: 20,
    maxZ: 27,
  };

  // P0 Sabit İstasyonları ve Mobilyaları
  public static readonly FIXTURES: WorldFixture[] = [
    {
      id: 'machine.water_spring',
      name: 'Memba Çeşmesi',
      bounds: { minX: 5, maxX: 6, minZ: 21, maxZ: 22 },
      serviceCell: { x: 7, z: 21.5 },
      color: '#35D9E6',
    },
    {
      id: 'machine.tomato_patch',
      name: 'Domates Yatağı',
      bounds: { minX: 5, maxX: 6, minZ: 25, maxZ: 26 },
      serviceCell: { x: 7, z: 25.5 },
      color: '#FF5733',
    },
    {
      id: 'machine.bottling_table',
      name: 'Şişeleme Tezgâhı',
      bounds: { minX: 12, maxX: 12.8, minZ: 22, maxZ: 23.8 },
      serviceCell: { x: 13.5, z: 22.5 },
      color: '#FFE156',
    },
    {
      id: 'fixture.sales_shelf',
      name: 'Satış Rafı',
      bounds: { minX: 12, maxX: 12.8, minZ: 25.8, maxZ: 26.8 },
      serviceCell: { x: 13.5, z: 26.3 },
      color: '#A7EB52',
    },
    {
      id: 'fixture.checkout',
      name: 'Kasa Masası',
      bounds: { minX: 16.5, maxX: 17, minZ: 22, maxZ: 23 },
      serviceCell: { x: 16, z: 22.5 },
      color: '#F4F0E6',
    },
  ];

  /**
   * Belirtilen koordinatın yürünebilir olup olmadığını kontrol eder.
   * Duvarlar, mobilyalar ve açılmamış odalar geçişi engeller.
   */
  public static isWalkable(x: number, z: number): boolean {
    // 1. İzin verilen yürüyüş bölgeleri kontrolü
    const inRoom =
      x >= this.ROOM_BOUNDS.minX &&
      x <= this.ROOM_BOUNDS.maxX &&
      z >= this.ROOM_BOUNDS.minZ &&
      z <= this.ROOM_BOUNDS.maxZ;

    const inGarden =
      x >= this.GARDEN_BOUNDS.minX &&
      x <= this.GARDEN_BOUNDS.maxX &&
      z >= this.GARDEN_BOUNDS.minZ &&
      z <= this.GARDEN_BOUNDS.maxZ;

    const inCorridor =
      x >= this.WEST_CORRIDOR.minX &&
      x <= this.WEST_CORRIDOR.maxX &&
      z >= this.WEST_CORRIDOR.minZ &&
      z <= this.WEST_CORRIDOR.maxZ;

    const inSouthEntrance =
      x >= this.SOUTH_ENTRANCE.minX &&
      x <= this.SOUTH_ENTRANCE.maxX &&
      z >= this.SOUTH_ENTRANCE.minZ &&
      z <= this.SOUTH_ENTRANCE.maxZ;

    if (!inRoom && !inGarden && !inCorridor && !inSouthEntrance) {
      return false;
    }

    // 2. İstasyon ve mobilya engelleri (çarpışma kutuları)
    for (const fixture of this.FIXTURES) {
      const margin = 0.2; // Karakter yarıçapı payı
      if (
        x >= fixture.bounds.minX - margin &&
        x <= fixture.bounds.maxX + margin &&
        z >= fixture.bounds.minZ - margin &&
        z <= fixture.bounds.maxZ + margin
      ) {
        return false;
      }
    }

    return true;
  }
}
