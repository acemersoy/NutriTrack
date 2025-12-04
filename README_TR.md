# 🌿 NutriTrack - Kişisel Beslenme ve Sağlık Takip Uygulaması

> Modern, kullanıcı dostu ve bilimsel verilere dayalı beslenme takip platformu

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com)

---

## 📸 Ekran Görüntüleri

| Ana Sayfa | Besin Takibi | Mikro Besinler | İlerleme |
|-----------|-------------|----------------|----------|
| Dashboard | USDA API    | 25+ Vitamin    | Grafikler|

---

## ✨ Özellikler

### 🍽️ **Besin Takibi**
- **300,000+ Yiyecek:** USDA FoodData Central API entegrasyonu
- **Detaylı Analiz:** Makro ve mikro besin değerleri
- **Öğün Bazlı:** Kahvaltı, öğle, akşam ve ara öğünler
- **Gramaj Ayarlama:** Özelleştirilebilir porsiyon ölçüleri

### 🧪 **Mikro Besin Takibi** (Cronometer Inspired)
- **25+ Vitamin ve Mineral:** A, C, D, E, K, B grubu vitaminleri
- **RDA Karşılaştırma:** Günlük önerilen değerlere göre yüzde hesaplama
- **Renkli Göstergeler:** Düşük/İyi/Tamamlandı durumları
- **Eksik Besin Uyarıları:** Akıllı öneri sistemi

### 📊 **İlerleme Takibi**
- **Görsel Raporlar:** Haftalık ve aylık grafikler
- **BMR/TDEE Hesaplama:** Kişiselleştirilmiş kalori hedefleri
- **Başarım Sistemi:** Motivasyon artırıcı rozetler
- **Geçmiş Analizi:** Tüm beslenme kayıtları

### 💧 **Ek Özellikler**
- Su takibi ve günlük hedefler
- Adet takibi (kadın kullanıcılar için)
- Koyu/Açık tema desteği
- Responsive tasarım (Mobil/Tablet/Desktop)
- Swipe navigation (Mobil için)
- Offline çalışma (localStorage)

---

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin
```bash
git clone https://github.com/KULLANICI_ADI/nutritrack.git
cd nutritrack
```

### 2. Tarayıcıda Açın
```bash
# Basit HTTP sunucusu başlatın
python -m http.server 8000
# veya
npx serve

# Tarayıcıda açın
http://localhost:8000
```

### 3. USDA API Key Alın (Opsiyonel)
```
1. https://fdc.nal.usda.gov/api-key-signup.html
2. Ücretsiz API key alın
3. main.js'de API_KEY'i değiştirin
```

---

## 🛠️ Teknoloji Stack

### Frontend
- **HTML5:** Semantik markup
- **CSS3:** Modern animasyonlar, Grid/Flexbox
- **JavaScript (ES6+):** OOP, Async/Await
- **Font Awesome:** İkonlar
- **Chart.js:** Görsel grafikler
- **Google Fonts:** Inter tipografi

### API'ler
- **USDA FoodData Central:** Besin veritabanı
- **localStorage API:** Yerel veri saklama
- **Touch Events API:** Mobil swipe navigation

### Tasarım Sistemleri
- **Material Design 3** (Google)
- **WCAG 2.1 AA** (Erişilebilirlik)
- **Mobile First** (Responsive)

---

## 📁 Proje Yapısı

```
OKComputer_Kalori_Uyg/
├── index.html              # Ana sayfa (Dashboard)
├── nutrition.html          # Besin takibi ve mikro besinler
├── profile.html            # Profil ve ayarlar
├── progress.html           # İlerleme ve grafikler
├── main.js                 # Ana JavaScript logic
├── swipe.js               # Mobil swipe navigation
├── styles.css             # Global stiller
├── README.md              # Dokümantasyon
├── DEPLOYMENT_GUIDE.md    # Deployment rehberi
└── LICENSE                # MIT License
```

---

## 🎨 Tasarım Özellikleri

### Dark Mode Desteği
- Sistem tercihi algılama
- Manuel tema değiştirme
- Smooth geçişler
- WCAG uyumlu kontrast oranları

### Responsive Design
- **Desktop (1200px+):** Grid layout, 3-4 kolon
- **Tablet (768px-1024px):** 2 kolon, optimize edilmiş
- **Mobile (< 768px):** 1 kolon, touch-friendly

### Erişilebilirlik
- WCAG 2.1 AA standardı
- Keyboard navigation
- Screen reader uyumlu
- Yüksek kontrast modlar

---

## 📊 Kullanılan Standartlar

### Material Design 3 (Google)
```css
Surface: rgba(30, 30, 40, 0.95)
Elevated Surface: rgba(40, 40, 55, 0.95)
High Emphasis Text: rgba(255, 255, 255, 0.87)
```

### WCAG 2.1 (W3C)
```css
Minimum Kontrast: 4.5:1 (AA)
Büyük Metin: 3:1 (AA)
Tüm metinler: 7:1+ (AAA) hedef
```

---

## 🔧 Geliştirme

### Yeni Özellik Ekleme
```javascript
// 1. main.js'e fonksiyon ekle
class NutriTrack {
    newFeature() {
        // Kodunuz
    }
}

// 2. HTML'e UI ekle
<button onclick="app.newFeature()">Yeni Özellik</button>

// 3. CSS ile stillendir
```

### Debug
```javascript
// Console'da app objesine erişin
console.log(app);
console.log(app.todayData);
console.log(app.userData);
```

---

## 📝 LocalStorage Yapısı

```javascript
// Kullanıcı verileri
nutritrack_user: {
    name: "string",
    age: number,
    weight: number,
    height: number,
    gender: "male|female",
    goal: "lose|gain|maintain|muscle",
    activityLevel: "sedentary|light|moderate|active|very_active"
}

// Günlük veriler
nutritrack_today: {
    calories: number,
    water: number,
    foods: [
        {
            id: number,
            name: "string",
            amount: number,
            calories: number,
            mealType: "breakfast|lunch|dinner|snack",
            nutrients: { protein, carbs, fat, ... }
        }
    ]
}

// Geçmiş veriler
nutritrack_history: {
    "2025-12-04": {
        foods: [...],
        calories: number,
        water: number
    }
}
```

---

## 🐛 Bilinen Sorunlar ve Çözümler

### Sorun: USDA API yavaş yanıt veriyor
**Çözüm:** Demo verileri otomatik gösterilir

### Sorun: localStorage doldu (5-10MB limit)
**Çözüm:** Eski verileri temizleyin veya backend kullanın

### Sorun: Chart görünmüyor
**Çözüm:** Chart.js CDN'i kontrol edin, sayfayı yenileyin

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👥 İletişim

**Proje Linki:** [https://github.com/KULLANICI_ADI/nutritrack](https://github.com)

**Geliştirici:** Avni Cem Ersoy

---

## 🙏 Teşekkürler

- [USDA FoodData Central](https://fdc.nal.usda.gov/) - Besin veritabanı
- [Chart.js](https://www.chartjs.org/) - Grafik kütüphanesi
- [Font Awesome](https://fontawesome.com/) - İkonlar
- [Google Fonts](https://fonts.google.com/) - Tipografi
- [Material Design](https://m3.material.io/) - Tasarım rehberi

---

## 📈 Versiyon Geçmişi

### v1.0.0 (2025-12-04)
- ✨ İlk sürüm
- ✅ Besin takibi (USDA API)
- ✅ Mikro besin takibi (25+ besin)
- ✅ BMR/TDEE hesaplama
- ✅ Su ve adet takibi
- ✅ Dark mode
- ✅ Responsive design
- ✅ Swipe navigation

---

**⭐ Projeyi beğendiyseniz GitHub'da yıldız vermeyi unutmayın!**

Made with ❤️ and ☕

