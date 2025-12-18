# 📱 Android Uygulama İkonu Değiştirme Rehberi

## 🎯 Yöntem 1: Capacitor Assets Plugin (ÖNERİLEN - En Kolay)

### Adım 1: Plugin'i Kur
```bash
npm install @capacitor/assets
```

### Adım 2: Ana İkon Dosyasını Hazırla
Ana klasörde (proje kökünde) bir `icon.png` dosyası oluştur:
- **Boyut:** 1024x1024 piksel
- **Format:** PNG
- **Arka plan:** Şeffaf veya dolu (Android adaptive icon için)
- **İçerik:** NutriTrack logosu

### Adım 3: İkonları Oluştur
```bash
npx @capacitor/assets generate --iconPath ./icon.png --splashPath ./splash.png
```

Bu komut otomatik olarak:
- Tüm Android icon boyutlarını oluşturur
- Adaptive icon'ları ayarlar
- Splash screen'i de günceller

### Adım 4: Sync Et
```bash
npm run android:sync
```

## 🛠️ Yöntem 2: Manuel Değiştirme (Daha Fazla Kontrol)

### Adım 1: İkon Dosyalarını Hazırla

Aşağıdaki boyutlarda PNG dosyaları hazırla:

| Klasör | Boyut | Dosya Adı |
|--------|-------|-----------|
| `mipmap-mdpi` | 48x48 | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-hdpi` | 72x72 | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-xhdpi` | 96x96 | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-xxhdpi` | 144x144 | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-xxxhdpi` | 192x192 | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |

**Not:** 
- `ic_launcher.png` = Normal icon
- `ic_launcher_round.png` = Yuvarlak icon (bazı Android sürümleri için)
- `ic_launcher_foreground.png` = Adaptive icon için ön plan (şeffaf arka planlı)

### Adım 2: Dosyaları Kopyala

Her klasöre ilgili boyuttaki icon'ları kopyala:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   ├── ic_launcher_round.png (48x48)
│   └── ic_launcher_foreground.png (48x48)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   ├── ic_launcher_round.png (72x72)
│   └── ic_launcher_foreground.png (72x72)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   ├── ic_launcher_round.png (96x96)
│   └── ic_launcher_foreground.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   ├── ic_launcher_round.png (144x144)
│   └── ic_launcher_foreground.png (144x144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    ├── ic_launcher_round.png (192x192)
    └── ic_launcher_foreground.png (192x192)
```

### Adım 3: Arka Plan Rengini Ayarla

`android/app/src/main/res/values/ic_launcher_background.xml` dosyasını düzenle:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#667eea</color> <!-- NutriTrack ana rengi -->
</resources>
```

VEYA `drawable/ic_launcher_background.xml` dosyasını düzenle.

### Adım 4: Android Studio'da Rebuild

1. Android Studio'yu aç
2. **Build > Clean Project**
3. **Build > Rebuild Project**
4. Uygulamayı çalıştır

## 🎨 Online İkon Oluşturucular

İkon dosyalarını hazırlamak için:

1. **Android Asset Studio** (Google'ın resmi aracı):
   - https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - 1024x1024 PNG yükle, otomatik tüm boyutları oluşturur

2. **App Icon Generator**:
   - https://www.appicon.co/
   - Tek bir dosyadan tüm platformlar için icon oluşturur

3. **Icon Kitchen** (Google):
   - https://icon.kitchen/
   - Adaptive icon'lar için özel

## 📝 Hızlı Adımlar (Özet)

**En Kolay Yol:**
```bash
# 1. Plugin kur
npm install @capacitor/assets

# 2. 1024x1024 icon.png hazırla (proje kökünde)

# 3. İkonları oluştur
npx @capacitor/assets generate --iconPath ./icon.png

# 4. Sync et
npm run android:sync

# 5. Android Studio'da Rebuild
```

## 🔍 İkon Dosyalarının Konumu

```
android/app/src/main/res/
├── mipmap-*/          → Icon dosyaları
├── drawable/          → Splash screen
└── values/            → Renk ayarları
```

## ⚠️ Önemli Notlar

1. **Adaptive Icons (Android 8.0+):**
   - `ic_launcher_foreground.png` şeffaf arka planlı olmalı
   - Arka plan rengi `ic_launcher_background.xml`'de tanımlı

2. **Icon Tasarımı:**
   - Merkeze yakın yerleştir (kenarlar kesilebilir)
   - Yuvarlak icon için kenarlarda boşluk bırak
   - Yüksek kaliteli PNG kullan

3. **Değişiklikleri Görmek:**
   - Uygulamayı cihazdan tamamen sil
   - Yeniden yükle
   - VEYA Android Studio'da **Build > Clean Project** yap

## 🎯 NutriTrack İçin Öneriler

- Ana renk: #667eea (mor-mavi gradient)
- İkon: Beslenme/sağlık temalı (yeşil yaprak, kalp, besin simgesi)
- Arka plan: Gradient veya düz renk
- Şeffaf arka plan: Adaptive icon için önerilir

