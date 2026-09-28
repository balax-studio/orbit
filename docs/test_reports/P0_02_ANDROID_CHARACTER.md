# P0-02 — Android dünya, dokunmatik hareket ve karakter doğrulaması

Tarih: 2026-09-28  
Cihaz: Xiaomi M2101K6G, Android 13, 1080×2400, ADB serial `d0a5cbe`.

## Gerçek kontroller

- `npm run build` — başarılı. Vite yalnızca mevcut büyük JavaScript chunk uyarısını verdi.
- `npm run lint` — başarılı.
- `npm test -- tests/unit/character_rigs.test.ts tests/unit/p0_world_input.test.ts` — 2 dosya, 19 test geçti. Dünya/başlangıç footprint'i, UI pointer izolasyonu, touch/joystick vektörü, portre kamera çerçevesi ve oyuncu/görevli/müşteri yürüyüş pozları kontrol edildi.
- `npx cap sync android` ve JDK 21 ile `android/gradlew.bat assembleDebug` — başarılı.
- Debug APK ADB ile cihaza kuruldu ve açıldı. Son 500 logcat satırında fatal exception, WebGL veya JavaScript hatası görülmedi.
- Joystick üzerinde `adb shell input swipe 180 1280 205 1280 12000` ile klavyesiz dokunuş yapıldı; oyuncu ve kamera satış rafına doğru ilerledi.
- Portre ekran görüntüsünde oyuncu ve seçili hedef halkası alt HUD başlamadan önce görünür. UI'da başlayan pointer'ın dünya komutu üretmediği P0-02 birim testinde doğrulandı.

## Görsel kanıt

- [Son Android APK'sından oyun görüntüsü](P0_02_ANDROID_CHARACTER.png)
- [Joystick hareketi sırasında oyun görüntüsü](P0_02_ANDROID_MOVEMENT.png)
- Üç rolün render taslağı `http://localhost:3123` içindeki Orbit character trio modelinde açık. Oyuncu ve görevli telefonda görünüyor. Bu test açılışında müşteri oyun döngüsünde doğmadı; müşteri modeli render önizlemesinde ve aynı yürüyüş rig'i testinde yer alıyor.

## Kapsam durumu

Kanıt P0-02'nin üç kabul ölçütünü kapsar. Bu test, P0-09 için gereken dış oyuncu çekirdek döngüsü veya iOS cihaz kabulü değildir.
