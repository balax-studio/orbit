# UI Tasarım Sistemi (AI Geliştirici Paketi)

Bu dosya, arayüzü inşa edecek ajan için **kesin CSS, Tailwind yapılandırması ve Bileşen hiyerarşisi** kurallarını barındırır.

## 1. Tailwind Config (tailwind.config.js)
Ajan, Tailwind konfigürasyonunu tam olarak aşağıdaki gibi oluşturmalıdır:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: "#F2F0E9",      // Paper White
          surface: "#FFFFFF", // Pure White
          ink: "#1A1A1A",     // Ink Black
          yellow: "#FFD000",  // Signal Yellow
          cyan: "#00F0FF",    // Electric Cyan
          green: "#00FF66",   // Vivid Green
          red: "#FF003C",     // Alert Red
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(26, 26, 26, 1)', // Hard shadow
        'neo-hover': '2px 2px 0px 0px rgba(26, 26, 26, 1)',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'], // Neo-Brutalist standart tipografi
      }
    },
  },
  plugins: [],
}
```

## 2. Ortak UI Bileşeni Kuralları
Tüm UI bileşenleri React'te şu Neo-Brutalist sınıfları kullanmalıdır:

**Buton Sınıfları (NeoButton):**
`bg-neo-yellow border-3 border-neo-ink shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-4 py-2 font-mono font-bold text-neo-ink`

**Kart Sınıfları (NeoCard):**
`bg-neo-surface border-3 border-neo-ink shadow-neo p-4 font-mono`

**Uyarı/Hata (NeoAlert):**
`bg-neo-red border-3 border-neo-ink shadow-neo text-neo-surface p-2 font-bold`

## 3. Bileşen Hiyerarşisi (Component Tree)
```text
src/components/ui/
├── HUD.tsx             // Kredi, Zaman, Üst Göstergeler
├── ActionMenu.tsx      // Tıklanan nesnenin bağlamsal butonları (Al, Sat, Kapat)
├── InventoryPanel.tsx  // Sağ çekmece (Drawer) - Envanter listesi
├── BuildOverlay.tsx    // İnşa modu açıkken çıkan ekran (grid snap vb.)
└── shared/
    ├── NeoButton.tsx
    ├── NeoCard.tsx
    └── NeoBadge.tsx
```

## 4. Kısıtlamalar (AI İçin Kırmızı Çizgiler)
- **Gradients Kesinlikle Yasak:** Arayüzde `bg-gradient-*` kullanılamaz.
- **Yumuşak Gölgeler Yasak:** `shadow-md`, `shadow-lg` (bulanık gölgeler) kullanılamaz. Sadece `shadow-neo` kullanılacaktır.
- **Kart İçinde Kart:** İç içe geçmiş karmaşık kart tasarımlarından kaçınılmalı, UI tek katmanlı (flat) ve cesur olmalıdır.
- **Hareket (Motion):** Sadece Transform (translate, scale) ve Opacity kullanılır. Genişlik/Yükseklik animasyonları (layout trashing) yasaktır.
