// NutriTrack - Ana JavaScript Dosyası
// Tüm uygulama işlevleri ve veri yönetimi

class NutriTrack {
    constructor() {
        this.userData = {};
        this.todayData = {};
        this.USDA_API_KEY = 'KbMh9bZk9sqAOgaAqsBdw77wn2hb31o7qRvJbzkH'; // Gerçek kullanım için kendi API key'inizi alın
        
        this.init();
    }

    // Uygulama başlatma
    init() {
        this.loadUserData();
        this.loadTodayData();
        this.setupEventListeners();
        this.checkDailyReset();
    }

    // Kullanıcı verilerini yükles
    loadUserData() {
        this.userData = JSON.parse(localStorage.getItem('nutritrack_user') || '{}');
        
        // Varsayılan değerler
        if (!this.userData.startDate) {
            this.userData.startDate = new Date().toISOString();
        }
        if (!this.userData.cycleLength) {
            this.userData.cycleLength = 28;
        }
        if (!this.userData.goal) {
            this.userData.goal = 'maintain';
        }
    }

    // Günlük verileri yükle
    loadTodayData() {
        this.todayData = JSON.parse(localStorage.getItem('nutritrack_today') || '{}');
        
        // Varsayılan değerler
        if (!this.todayData.calories) this.todayData.calories = 0;
        if (!this.todayData.water) this.todayData.water = 0;
        if (!this.todayData.foods) this.todayData.foods = [];
    }

    // Verileri kaydet
    saveUserData() {
        localStorage.setItem('nutritrack_user', JSON.stringify(this.userData));
    }

    saveTodayData() {
        localStorage.setItem('nutritrack_today', JSON.stringify(this.todayData));
    }

    // Event listener'ları ayarla
    setupEventListeners() {
        // Sayfa yüklendiğinde
        document.addEventListener('DOMContentLoaded', () => {
            this.updateDashboard();
        });

        // Sayfa görünür olduğunda güncelle
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkDailyReset();
                this.updateDashboard();
            }
        });
    }

    // Günlük sıfırlama kontrolü
    checkDailyReset() {
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('nutritrack_last_reset');
        
        if (lastReset !== today) {
            // Önceki günün verilerini geçmişe kaydet
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const previousDayData = this.todayData;
            if (previousDayData.foods && previousDayData.foods.length > 0) {
                let historyData = JSON.parse(localStorage.getItem('nutritrack_history') || '{}');
                historyData[yesterdayStr] = {
                    foods: previousDayData.foods,
                    calories: previousDayData.calories || 0,
                    water: previousDayData.water || 0
                };
                localStorage.setItem('nutritrack_history', JSON.stringify(historyData));
            }
            
            // Yeni gün başladı, verileri sıfırla
            this.todayData = {
                calories: 0,
                water: 0,
                foods: []
            };
            this.saveTodayData();
            localStorage.setItem('nutritrack_last_reset', today);
        }
    }

    // Dashboard'u güncelle
    updateDashboard() {
        if (document.getElementById('todayCalories')) {
            document.getElementById('todayCalories').textContent = this.todayData.calories;
        }
        if (document.getElementById('todayWater')) {
            document.getElementById('todayWater').textContent = this.todayData.water;
        }
        
        // BMR hesapla
        if (this.userData.weight && this.userData.height && this.userData.age && this.userData.gender) {
            const bmr = this.calculateBMR();
            if (document.getElementById('bmrValue')) {
                document.getElementById('bmrValue').textContent = Math.round(bmr);
            }
        }
    }

    // BMR hesaplama
    calculateBMR() {
        const { weight, height, age, gender } = this.userData;
        
        if (!weight || !height || !age || !gender) return 0;

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.677 * age);
        }

        return bmr;
    }

    // TDEE hesaplama (Total Daily Energy Expenditure)
    calculateTDEE() {
        const bmr = this.calculateBMR();
        if (!bmr) return 0;

        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };

        const multiplier = activityMultipliers[this.userData.activityLevel] || 1.2;
        return bmr * multiplier;
    }

    // Hedefe göre günlük kalori hedefi
    getTargetCalories() {
        const tdee = this.calculateTDEE();
        if (!tdee) return 2000; // Varsayılan değer

        let targetCalories = tdee;
        
        switch (this.userData.goal) {
            case 'lose':
                targetCalories = tdee - 500; // Haftada 0.5kg
                break;
            case 'gain':
                targetCalories = tdee + 500; // Haftada 0.5kg
                break;
            case 'muscle':
                targetCalories = tdee + 300; // Kas kazanımı için
                break;
            default:
                targetCalories = tdee; // Kilo koruma
        }

        return Math.round(targetCalories);
    }

    // Makro besin hedefleri
    getMacroTargets() {
        const targetCalories = this.getTargetCalories();
        
        let proteinRatio, carbRatio, fatRatio;
        
        switch (this.userData.goal) {
            case 'muscle':
                proteinRatio = 0.30;
                fatRatio = 0.25;
                carbRatio = 0.45;
                break;
            case 'lose':
                proteinRatio = 0.35;
                fatRatio = 0.25;
                carbRatio = 0.40;
                break;
            default:
                proteinRatio = 0.25;
                fatRatio = 0.30;
                carbRatio = 0.45;
        }

        return {
            protein: Math.round((targetCalories * proteinRatio) / 4),
            carbs: Math.round((targetCalories * carbRatio) / 4),
            fat: Math.round((targetCalories * fatRatio) / 9)
        };
    }

    // Yiyecek ekleme
    addFood(foodItem) {
        this.todayData.foods.push(foodItem);
        this.todayData.calories += foodItem.calories;
        this.saveTodayData();
        this.updateDashboard();
    }

    // Yiyecek silme
    removeFood(foodId) {
        const foodIndex = this.todayData.foods.findIndex(f => f.id === foodId);
        if (foodIndex !== -1) {
            const removedFood = this.todayData.foods[foodIndex];
            this.todayData.calories -= removedFood.calories;
            this.todayData.foods.splice(foodIndex, 1);
            this.saveTodayData();
            this.updateDashboard();
            return removedFood;
        }
        return null;
    }

    // Su ekleme
    addWater(amount = 1) {
        this.todayData.water += amount;
        this.saveTodayData();
        this.updateDashboard();
    }

    // Adet takibi güncelleme
    updatePeriodTracking() {
        const today = new Date();
        this.userData.lastPeriod = today.toISOString();
        this.saveUserData();
    }

    // Sonraki adet tarihini hesapla
    getNextPeriodDate() {
        if (!this.userData.lastPeriod) return null;
        
        const lastPeriod = new Date(this.userData.lastPeriod);
        const cycleLength = this.userData.cycleLength || 28;
        
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
        
        return nextPeriod;
    }

    // Adete kaç gün kaldı
    getDaysUntilPeriod() {
        const nextPeriod = this.getNextPeriodDate();
        if (!nextPeriod) return null;
        
        const today = new Date();
        const diffTime = nextPeriod - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // USDA API ile yiyecek arama (Cache destekli)
    async searchFoods(query) {
        if (!query || query.trim().length === 0) {
            return [];
        }

        // 1. Önce cache'de ara
        let cachedResults = [];
        try {
            if (typeof foodCache !== 'undefined') {
                cachedResults = await foodCache.searchFoods(query);
                console.log(`📦 Cache'den ${cachedResults.length} sonuç bulundu`);
            }
        } catch (error) {
            console.warn('Cache arama hatası:', error);
        }

        // 2. Cache'de yeterli sonuç varsa (5+), onları döndür (hızlı!)
        if (cachedResults.length >= 5) {
            console.log('⚡ Cache\'den hızlı sonuç döndürülüyor');
            return cachedResults;
        }

        // 3. API'ye istek at (cache'de yoksa veya az sonuç varsa)
        if (this.USDA_API_KEY === 'DEMO_KEY') {
            return this.getDemoFoods(query);
        }

        try {
            const response = await fetch(
                `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${this.USDA_API_KEY}&pageSize=20`
            );
            const data = await response.json();
            const apiResults = data.foods || [];

            // 4. API'den gelen sonuçları cache'e kaydet (arka planda)
            if (apiResults.length > 0 && typeof foodCache !== 'undefined') {
                foodCache.saveFoods(apiResults).catch(error => {
                    console.warn('Cache kayıt hatası:', error);
                });
                console.log(`💾 ${apiResults.length} besin cache'e kaydedildi`);
            }

            // 5. Cache ve API sonuçlarını birleştir (duplicate kontrolü)
            const combinedResults = [...cachedResults];
            const cachedIds = new Set(cachedResults.map(f => f.fdcId));

            apiResults.forEach(food => {
                if (!cachedIds.has(food.fdcId)) {
                    combinedResults.push(food);
                }
            });

            return combinedResults.slice(0, 20); // Maksimum 20 sonuç
        } catch (error) {
            console.error('USDA API hatası:', error);
            
            // API hatası durumunda cache'den döndür
            if (cachedResults.length > 0) {
                console.log('⚠️ API hatası, cache\'den sonuç döndürülüyor');
                return cachedResults;
            }
            
            return this.getDemoFoods(query);
        }
    }

    // Demo yiyecek verileri (Sadece API çalışmazsa fallback)
    // USDA API kullanıldığında bu fonksiyon çağrılmaz - tüm veriler API'den gelir
    getDemoFoods(query) {
        console.log('⚠️ API kullanılamıyor, demo veriler gösteriliyor');
        

        // Not: Gerçek USDA API kullanımında bu fonksiyon çağrılmaz
        // API çağrısı her zaman 150+ besin değeriyle döner
        return demoFoods.filter(food => 
            food.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Günlük önerilen değerler (RDA) - Yetişkin için ortalama
    getRDA() {
        const gender = this.userData.gender || 'male';
        const age = this.userData.age || 30;
        
        // Temel RDA değerleri (yetişkin için)
        const rda = {
            // Vitaminler
            'Vitamin A, RAE': { value: gender === 'male' ? 900 : 700, unit: 'µg', name: 'A Vitamini' },
            'Vitamin C, total ascorbic acid': { value: gender === 'male' ? 90 : 75, unit: 'mg', name: 'C Vitamini' },
            'Vitamin D (D2 + D3)': { value: 15, unit: 'µg', name: 'D Vitamini' },
            'Vitamin E (alpha-tocopherol)': { value: 15, unit: 'mg', name: 'E Vitamini' },
            'Vitamin K (phylloquinone)': { value: gender === 'male' ? 120 : 90, unit: 'µg', name: 'K Vitamini' },
            'Thiamin': { value: gender === 'male' ? 1.2 : 1.1, unit: 'mg', name: 'B1 Vitamini (Tiamin)' },
            'Riboflavin': { value: gender === 'male' ? 1.3 : 1.1, unit: 'mg', name: 'B2 Vitamini (Riboflavin)' },
            'Niacin': { value: gender === 'male' ? 16 : 14, unit: 'mg', name: 'B3 Vitamini (Niasin)' },
            'Vitamin B-6': { value: age < 50 ? 1.3 : (gender === 'male' ? 1.7 : 1.5), unit: 'mg', name: 'B6 Vitamini' },
            'Folate, total': { value: 400, unit: 'µg', name: 'Folat (B9)' },
            'Vitamin B-12': { value: 2.4, unit: 'µg', name: 'B12 Vitamini' },
            
            // Mineraller
            'Calcium, Ca': { value: age < 50 ? 1000 : 1200, unit: 'mg', name: 'Kalsiyum' },
            'Iron, Fe': { value: gender === 'male' ? 8 : (age < 50 ? 18 : 8), unit: 'mg', name: 'Demir' },
            'Magnesium, Mg': { value: gender === 'male' ? 420 : 320, unit: 'mg', name: 'Magnezyum' },
            'Phosphorus, P': { value: 700, unit: 'mg', name: 'Fosfor' },
            'Potassium, K': { value: 3400, unit: 'mg', name: 'Potasyum' },
            'Sodium, Na': { value: 2300, unit: 'mg', name: 'Sodyum', isLimit: true }, // Maksimum limit
            'Zinc, Zn': { value: gender === 'male' ? 11 : 8, unit: 'mg', name: 'Çinko' },
            'Copper, Cu': { value: 0.9, unit: 'mg', name: 'Bakır' },
            'Selenium, Se': { value: 55, unit: 'µg', name: 'Selenyum' },
            'Manganese, Mn': { value: gender === 'male' ? 2.3 : 1.8, unit: 'mg', name: 'Manganez' },
            
            // Diğer besinler
            'Fiber, total dietary': { value: gender === 'male' ? 38 : 25, unit: 'g', name: 'Lif' },
            'Cholesterol': { value: 300, unit: 'mg', name: 'Kolesterol', isLimit: true },
            'Fatty acids, total saturated': { value: 20, unit: 'g', name: 'Doymuş Yağ', isLimit: true }
        };
        
        return rda;
    }

    // Besin değerlerini hesapla (GENİŞLETİLMİŞ - Mikro besinler dahil)
    calculateNutrition(food, portion = 100) {
        const multiplier = portion / 100;
        const nutrients = {};

        if (food.foodNutrients) {
            food.foodNutrients.forEach(nutrient => {
                const name = nutrient.nutrientName;
                const value = nutrient.value * multiplier;
                
                // Tüm besin değerlerini sakla (mikro besinler dahil)
                if (value && value > 0) {
                    nutrients[name] = {
                        value: Math.round(value * 1000) / 1000, // 3 ondalık basamak
                        unit: nutrient.unitName
                    };
                }
                
                // Hızlı erişim için temel besinler
                if (name.toLowerCase().includes('energy')) {
                    nutrients.calories = Math.round(value);
                } else if (name.toLowerCase().includes('protein')) {
                    nutrients.protein = Math.round(value * 100) / 100;
                } else if (name.toLowerCase().includes('carbohydrate')) {
                    nutrients.carbs = Math.round(value * 100) / 100;
                } else if (name.toLowerCase().includes('fat') && !name.toLowerCase().includes('protein')) {
                    nutrients.fat = Math.round(value * 100) / 100;
                } else if (name.toLowerCase().includes('fiber')) {
                    nutrients.fiber = Math.round(value * 100) / 100;
                } else if (name.toLowerCase().includes('sugar')) {
                    nutrients.sugar = Math.round(value * 100) / 100;
                }
            });
        }

        return nutrients;
    }

    // Günlük mikro besin tüketimini hesapla
    calculateDailyMicronutrients() {
        const foods = this.todayData.foods || [];
        const micronutrients = {};
        const rda = this.getRDA();
        
        // Tüm besinleri topla
        foods.forEach(food => {
            if (food.nutrients) {
                Object.keys(food.nutrients).forEach(nutrientName => {
                    const nutrient = food.nutrients[nutrientName];
                    
                    if (typeof nutrient === 'object' && nutrient.value !== undefined) {
                        if (!micronutrients[nutrientName]) {
                            micronutrients[nutrientName] = {
                                consumed: 0,
                                unit: nutrient.unit,
                                name: nutrientName
                            };
                        }
                        micronutrients[nutrientName].consumed += nutrient.value;
                    }
                });
            }
        });
        
        // RDA ile karşılaştır ve yüzde hesapla
        const results = [];
        Object.keys(rda).forEach(nutrientKey => {
            const rdaInfo = rda[nutrientKey];
            const consumed = micronutrients[nutrientKey]?.consumed || 0;
            const percentage = (consumed / rdaInfo.value) * 100;
            
            results.push({
                key: nutrientKey,
                name: rdaInfo.name,
                consumed: Math.round(consumed * 100) / 100,
                target: rdaInfo.value,
                unit: rdaInfo.unit,
                percentage: Math.min(percentage, 100),
                actualPercentage: percentage,
                isLimit: rdaInfo.isLimit || false,
                status: rdaInfo.isLimit 
                    ? (percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good')
                    : (percentage >= 100 ? 'complete' : percentage >= 70 ? 'good' : percentage >= 30 ? 'fair' : 'low')
            });
        });
        
        // Öncelik sırasına göre sırala (eksik olanlar üstte)
        results.sort((a, b) => {
            if (a.status === 'low' && b.status !== 'low') return -1;
            if (a.status !== 'low' && b.status === 'low') return 1;
            return a.percentage - b.percentage;
        });
        
        return results;
    }

    // Eksik besinleri al
    getDeficientNutrients() {
        const micronutrients = this.calculateDailyMicronutrients();
        return micronutrients.filter(n => n.percentage < 70 && !n.isLimit);
    }

    // Fazla besinleri al
    getExcessNutrients() {
        const micronutrients = this.calculateDailyMicronutrients();
        return micronutrients.filter(n => n.isLimit && n.percentage > 100);
    }

    // Bildirim gösterme
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? '#667eea' : '#ff4757';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // İlerleme yüzdesi hesaplama
    calculateProgress(current, target) {
        if (!target) return 0;
        return Math.min((current / target) * 100, 100);
    }

    // Haftalık ortalama hesaplama
    getWeeklyAverage() {
        // Bu fonksiyon gerçek uygulamada localStorage'dan geçmiş verileri alır
        // Şimdilik bugünkü verileri kullanıyoruz
        return {
            calories: this.todayData.calories || 0,
            water: this.todayData.water || 0,
            protein: this.calculateTodayProtein()
        };
    }

    // Bugünkü protein miktarını hesapla
    calculateTodayProtein() {
        if (!this.todayData.foods || this.todayData.foods.length === 0) return 0;
        
        return this.todayData.foods.reduce((total, food) => {
            return total + (food.nutrients?.protein || 0);
        }, 0);
    }

    // Uygulama hakkında bilgi
    getAppInfo() {
        return {
            version: '1.0.0',
            name: 'NutriTrack',
            description: 'Kişisel sağlık ve beslenme takip uygulaması',
            features: [
                'USDA veritabanı ile besin takibi',
                'BMR ve TDEE hesaplama',
                'Makro/mikro besin analizi',
                'Su takibi',
                'Adet takibi',
                'İlerleme raporları',
                'Başarı sistemi'
            ]
        };
    }
}

// Uygulama örneği oluştur
const app = new NutriTrack();

// Global fonksiyonlar - HTML onclick'lerden çağrılır
window.addWater = function() {
    app.addWater(1);
    app.showNotification('Bir bardak su eklendi! 💧');
};

window.trackPeriod = function() {
    app.updatePeriodTracking();
    app.showNotification('Adet takibi güncellendi! 🌸');
};

window.showNotification = function(message, type = 'success') {
    app.showNotification(message, type);
};

// CSS animasyonları için stiller
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease;
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

// Uygulama dışa aktarımı
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NutriTrack;
}