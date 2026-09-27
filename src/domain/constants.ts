// Orbit Market - Domain Constants
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §60-61, KARARLAR.md D-021, D-022

/**
 * Para hassasiyeti: 10.000 atom = 1 Kredi.
 * Tam sayılarla çalışılır, kayan noktalı yuvarlama hatası önlenir.
 */
export const ATOMS_PER_CREDIT = 10_000;

/**
 * Sabit simülasyon frekansı: 10 Hz (100 ms / tick).
 */
export const TICK_RATE_HZ = 10;
export const TICK_DURATION_MS = 100;

/**
 * 1 oyun günü = 900 aktif simülasyon saniyesi = 9.000 tick.
 */
export const DAY_ACTIVE_SECONDS = 900;
export const TICKS_PER_DAY = DAY_ACTIVE_SECONDS * TICK_RATE_HZ;

/**
 * Bir render karesinde işlenebilecek azami tick borcu.
 * Cihaz donmalarında simülasyonun sonsuz döngüye girmesini önler.
 */
export const MAX_TICKS_PER_FRAME = 5;
