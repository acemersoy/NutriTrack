# 🤝 Katkıda Bulunma Rehberi

NutriTrack'e katkıda bulunmak istediğiniz için teşekkürler! ❤️

## 🌟 Nasıl Katkıda Bulunabilirsiniz?

### 1. 🐛 Bug Raporu
Bir hata bulduysanız:
- GitHub Issues'da yeni issue açın
- Hatayı detaylı açıklayın
- Ekran görüntüsü ekleyin
- Hangi tarayıcı/cihaz kullandığınızı belirtin

### 2. 💡 Özellik Önerisi
Yeni özellik fikirleriniz varsa:
- GitHub Discussions'da tartışmaya açın
- Özelliğin faydalarını açıklayın
- Varsa mockup/örnek gösterin

### 3. 🔧 Kod Katkısı
Kod katkısında bulunmak için:

```bash
# 1. Fork yapın
# GitHub'da "Fork" butonuna tıklayın

# 2. Clone yapın
git clone https://github.com/KULLANICI_ADINIZ/nutritrack.git
cd nutritrack

# 3. Branch oluşturun
git checkout -b feature/yeni-özellik
# veya
git checkout -b fix/hata-düzeltmesi

# 4. Değişikliklerinizi yapın
# Kod yazın, test edin

# 5. Commit yapın
git add .
git commit -m "feat: yeni özellik eklendi"
# veya
git commit -m "fix: hata düzeltildi"

# 6. Push yapın
git push origin feature/yeni-özellik

# 7. Pull Request açın
# GitHub'da "New Pull Request" butonuna tıklayın
```

## 📝 Commit Mesaj Formatı

```
<tip>: <açıklama>

[opsiyonel gövde]

[opsiyonel footer]
```

### Commit Tipleri:
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı (işlevsel değişiklik yok)
- `refactor`: Kod iyileştirme
- `perf`: Performans iyileştirmesi
- `test`: Test ekleme/düzeltme
- `chore`: Bakım işleri

### Örnekler:
```
feat: mikro besin takibi eklendi
fix: dark mode'da chart yazıları düzeltildi
docs: deployment rehberi güncellendi
style: CSS formatı düzenlendi
perf: USDA API cache eklendi
```

## ✅ Kod Standartları

### JavaScript
- ES6+ syntax kullanın
- `const` ve `let` kullanın (`var` kullanmayın)
- Arrow functions tercih edin
- Async/await kullanın (callback yerine)
- Anlamlı değişken isimleri
- Fonksiyonlara yorum ekleyin

```javascript
// İyi ✅
const calculateBMR = (weight, height, age, gender) => {
    // Harris-Benedict formülü
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.677 * age);
};

// Kötü ❌
var bmr = function(w,h,a,g) {
    if(g=='m')return 88.362+13.397*w+4.799*h-5.677*a;
    return 447.593+9.247*w+3.098*h-4.677*a;
}
```

### CSS
- BEM metodolojisi kullanın
- CSS variables tercih edin
- Mobile-first yaklaşım
- Anlamlı class isimleri

```css
/* İyi ✅ */
.dashboard-card {
    background: var(--card-background);
    transition: all 0.3s ease;
}

.dashboard-card:hover {
    transform: translateY(-5px);
}

/* Kötü ❌ */
.dc { background:#fff; }
.dc:hover { transform:translateY(-5px); }
```

### HTML
- Semantik HTML5 elementleri
- ARIA labels (erişilebilirlik)
- Alt text'ler
- Meta tags

```html
<!-- İyi ✅ -->
<nav class="navigation" role="navigation" aria-label="Ana navigasyon">
    <a href="index.html" class="nav-item" aria-label="Ana Sayfa">
        <i class="fas fa-home" aria-hidden="true"></i>
    </a>
</nav>

<!-- Kötü ❌ -->
<div class="nav">
    <a href="index.html"><i class="fas fa-home"></i></a>
</div>
```

## 🧪 Test Etme

### Manuel Test Checklist:
- [ ] Chrome'da test edin
- [ ] Firefox'ta test edin
- [ ] Safari'de test edin (Mac/iOS)
- [ ] Edge'de test edin
- [ ] Mobil cihazda test edin
- [ ] Dark mode'u test edin
- [ ] Responsive tasarımı test edin
- [ ] Touch events test edin (mobil)
- [ ] Keyboard navigation test edin

### Test Senaryoları:
1. Yeni kullanıcı kaydı
2. Besin arama ve ekleme
3. Su ekleme
4. Mikro besin görüntüleme
5. Tema değiştirme
6. Geçmiş verileri görüntüleme
7. Profil güncelleme
8. Swipe navigation (mobil)

## 🎨 Tasarım Rehberi

### Renk Paleti
```css
/* Primary */
--primary-color: #667eea;
--secondary-color: #764ba2;

/* Status Colors */
--success: #27ae60;
--warning: #f39c12;
--danger: #e74c3c;

/* Dark Mode */
--dark-surface: rgba(30, 30, 40, 0.95);
--dark-text: rgba(255, 255, 255, 0.87);
```

### Tipografi
```css
/* Font Family */
font-family: 'Inter', sans-serif;

/* Font Sizes */
h1: 2.5rem (40px)
h2: 1.5rem (24px)
Body: 1rem (16px)
Small: 0.9rem (14px)
```

### Spacing
```css
/* Standart boşluklar */
--spacing-xs: 5px;
--spacing-sm: 10px;
--spacing-md: 20px;
--spacing-lg: 30px;
--spacing-xl: 40px;
```

## 📚 Dokümantasyon

Yeni özellik eklediğinizde:
- README.md'yi güncelleyin
- Kod yorumları ekleyin
- Örnekler verin
- Ekran görüntüleri ekleyin

## 🚀 Pull Request Süreci

1. **Fork & Clone**
2. **Branch oluştur**
3. **Değişiklikleri yap**
4. **Test et**
5. **Commit yap** (anlamlı mesajlarla)
6. **Push yap**
7. **PR aç** (detaylı açıklama ile)
8. **Review bekle**
9. **Feedback'e göre düzelt**
10. **Merge! 🎉**

## ⚠️ Yapmayın

- [ ] API key'leri commit etmeyin
- [ ] Console.log'ları bırakmayın (production'da)
- [ ] Büyük binary dosyalar eklemeyin
- [ ] Copyright'lı içerik kullanmayın
- [ ] Responsive testi yapmadan PR açmayın

## 💬 Sorularınız mı var?

- GitHub Discussions'da sorun
- Issue açın
- Email gönderin

**Katkılarınız için şimdiden teşekkürler! 🙏**

