# Orbit Market 🚀

**Orbit Market**, oyuncunun uzay kolonisi hammaddelerinden ürünler ürettiği, taşıyıp işlediği, otonom makineler ve personellerle işletmesini büyüttüğü tam teşekküllü, 3B (İzometrik) bir **Mobil İşletme Simülasyonudur**.

Oyun, kısa oturumları (3-8 dakika) hedefleyen mobil oyuncular için **Neo-Brutalist** bir sanat tasarımı ve modern web teknolojileri (Three.js & React) ile inşa edilmiş olup, **Capacitor** aracılığıyla yerel (Native) Android ve iOS uygulaması olarak paketlenecek şekilde tasarlanmıştır.

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Görsel & 3D Motor:** [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/)
- **Kullanıcı Arayüzü (UI):** [React 18](https://react.dev/)
- **Durum Yönetimi (State):** [Zustand](https://zustand-demo.pmnd.rs/) (Sadece saf mantık, UI'dan izole)
- **Stil & Tasarım:** [Tailwind CSS](https://tailwindcss.com/) (Özel konfigüre edilmiş Neo-Brutalist tasarım kısıtlamalarıyla)
- **Dil & Derleyici:** [TypeScript](https://www.typescriptlang.org/) & [Vite](https://vitejs.dev/)
- **Mobil Paketleyici:** [Capacitor](https://capacitorjs.com/) (iOS / Android)

## 📚 Dokümantasyon ve Yapay Zeka Paketleri (AI Packages)

Proje, kod yazımında sıfır hata payı (Zero-Ambiguity) ve Subagent güdümlü geliştirme prensipleri için yüksek seviye mimari dokümanlarına bölünmüştür:

1. **[DOMAIN_MODEL.md](./DOMAIN_MODEL.md)** - Zustand Store, TypeScript interfaceleri ve veri kısıtlamaları.
2. **[ECONOMY_AND_MACHINES.md](./ECONOMY_AND_MACHINES.md)** - 24 ürünün matematiksel formülleri, makine kalite ve kapasite döngüleri.
3. **[UI_DESIGN_SYSTEM.md](./UI_DESIGN_SYSTEM.md)** - Tailwind config kuralları, Neo-Brutalist CSS sınıfları ve UI bileşen hiyerarşisi.
4. **[CONTROLS_AND_UX.md](./CONTROLS_AND_UX.md)** - 3D raycaster kısıtlamaları, Joystick entegrasyonu, ve Build-Mode (İnşa Modu) akışı.
5. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 10Hz oyun/mantık döngüsü, Modül sınırları ve Capacitor yönergeleri.
6. **[RPG_AND_PROGRESSION.md](./RPG_AND_PROGRESSION.md)** - Tüccar, Mühendis, Toplulukçu dalındaki yetenek formülleri ve personel yorgunluk modeli.
7. **[STORY_AND_FACTIONS.md](./STORY_AND_FACTIONS.md)** - İtibar (Faction) puanlama sistemi ve Dünya Olayları (Events) JSON mimarisi.
8. **[OYUN_GELISTIRME_DEVIR_DOSYASI.md](./OYUN_GELISTIRME_DEVIR_DOSYASI.md)** - Orbit Market'in 2000 satırlık tam teşekküllü Game Design Document (GDD) ana sözleşmesi.

---

## 🎨 Sanat ve Tasarım Çizgisi: Neo-Brutalist
Oyun, sıradan mobil oyunların aksine **Neo-Brutalist** bir kimlikle tasarlanmıştır:
- Kalın siyah konturlar (3px hard borders).
- Yumuşak olmayan, keskin, koyu gölgeler (5px hard shadows).
- Düz ve cesur renk paleti: `Ink Black`, `Paper White`, `Signal Yellow`, `Electric Cyan`, `Vivid Green`, `Alert Red`.
- Gradyan (gradient), bulanıklık (blur) ve gömülü (inset) gölgeler **kesinlikle kullanılmaz**.

---

## 💻 Geliştirme (Development)

Projeyi yerel ortamınızda çalıştırmak için:

### 1. Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya pnpm

### 2. Kurulum
```bash
git clone https://github.com/balax-studio/orbit.git
cd orbit
npm install
```

### 3. Geliştirici Sunucusu (Dev Server)
Web üzerinde 3D ve UI testlerini yapmak için:
```bash
npm run dev
```
Bu komut, Vite HMR destekli geliştirici sunucusunu `http://localhost:5173` adresinde başlatacaktır.

---

## 📱 Mobil Çıktı Alma (Capacitor Build)

Uygulamanın Android veya iOS (Native) olarak paketlenmesi için aşağıdaki adımları izleyin:

### Android için
```bash
# 1. Projeyi React üzerinden derleyin
npm run build

# 2. Capacitor Android ortamını senkronize edin
npx cap sync android

# 3. Android Studio'yu başlatın (APK/AAB çıktısı için)
npx cap open android
```

### iOS için (macOS gerektirir)
```bash
# 1. Projeyi React üzerinden derleyin
npm run build

# 2. Capacitor iOS ortamını senkronize edin
npx cap sync ios

# 3. Xcode'u başlatın
npx cap open ios
```

---

## 🤝 Takım ve Katkı
**Balax Studio** tarafından geliştirilmektedir.
AI entegrasyonu ve doküman ayrıştırma aşamaları `Subagent-Driven Development` metodolojisine sıkı sıkıya bağlı kalınarak kurgulanmıştır. Tüm PR (Pull Request) ve kod katkılarının `ARCHITECTURE.md` sınırlarına uygunluğu zorunludur.
