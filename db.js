// NutriTrack - IndexedDB Cache Sistemi
// Food database önbellekleme ve offline erişim

class FoodCache {
    constructor() {
        this.dbName = 'NutriTrackDB';
        this.dbVersion = 1;
        this.storeName = 'foods';
        this.db = null;
        this.cacheTTL = 7 * 24 * 60 * 60 * 1000; // 7 gün (milisaniye)
        this.maxCacheSize = 1000; // Maksimum 1000 besin
    }

    // IndexedDB başlat
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('IndexedDB açılamadı:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB başarıyla açıldı');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Foods store oluştur
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'fdcId' });
                    
                    // Arama için index'ler
                    objectStore.createIndex('description', 'description', { unique: false });
                    objectStore.createIndex('cachedAt', 'cachedAt', { unique: false });
                    objectStore.createIndex('searchCount', 'searchCount', { unique: false });
                    
                    console.log('✅ IndexedDB store oluşturuldu');
                }
            };
        });
    }

    // Besin cache'e kaydet (duplicate kontrolü ile)
    async saveFood(food) {
        if (!this.db) await this.init();
        if (!food || !food.fdcId) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            // Önce mevcut kaydı kontrol et
            const checkRequest = store.get(food.fdcId);

            checkRequest.onsuccess = () => {
                const existingFood = checkRequest.result;

                if (existingFood) {
                    // Zaten var, sadece erişim sayısını ve zamanını güncelle
                    existingFood.searchCount = (existingFood.searchCount || 0) + 1;
                    existingFood.lastAccessed = Date.now();
                    
                    const updateRequest = store.put(existingFood);
                    updateRequest.onsuccess = () => {
                        console.log(`🔄 Besin cache'de güncellendi: ${food.description}`);
                        resolve(existingFood);
                    };
                    updateRequest.onerror = () => {
                        reject(updateRequest.error);
                    };
                } else {
                    // Yeni kayıt oluştur
                    const cachedFood = {
                        fdcId: food.fdcId,
                        description: food.description,
                        brandOwner: food.brandOwner || null,
                        dataType: food.dataType || 'Foundation',
                        foodNutrients: food.foodNutrients || [],
                        foodComponents: food.foodComponents || [],
                        foodAttributes: food.foodAttributes || [],
                        foodCategory: food.foodCategory || null,
                        cachedAt: Date.now(),
                        searchCount: 1,
                        lastAccessed: Date.now()
                    };

                    const putRequest = store.put(cachedFood);

                    putRequest.onsuccess = () => {
                        console.log(`💾 Besin cache'e kaydedildi: ${food.description}`);
                        resolve(cachedFood);
                    };

                    putRequest.onerror = () => {
                        console.error('Cache kayıt hatası:', putRequest.error);
                        reject(putRequest.error);
                    };
                }
            };

            checkRequest.onerror = () => {
                reject(checkRequest.error);
            };
        });
    }

    // Birden fazla besini toplu kaydet
    async saveFoods(foods) {
        if (!this.db) await this.init();

        const promises = foods.map(food => this.saveFood(food));
        return Promise.all(promises);
    }

    // FDC ID ile besin getir
    async getFood(fdcId) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(fdcId);

            request.onsuccess = () => {
                const food = request.result;
                
                if (food) {
                    // TTL kontrolü
                    const age = Date.now() - food.cachedAt;
                    if (age > this.cacheTTL) {
                        console.log(`⏰ Cache süresi dolmuş: ${food.description}`);
                        this.deleteFood(fdcId);
                        resolve(null);
                        return;
                    }

                    // Erişim sayısını artır ve son erişim zamanını güncelle
                    this.updateAccessStats(fdcId);
                    resolve(food);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Arama yap (description'a göre)
    async searchFoods(query) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('description');
            const request = index.getAll();

            request.onsuccess = () => {
                const allFoods = request.result;
                const now = Date.now();
                const queryLower = query.toLowerCase();

                // Filtreleme: query'ye uyan ve TTL içinde olanlar
                const results = allFoods
                    .filter(food => {
                        const age = now - food.cachedAt;
                        if (age > this.cacheTTL) {
                            // Süresi dolmuş, sil
                            this.deleteFood(food.fdcId);
                            return false;
                        }
                        return food.description.toLowerCase().includes(queryLower);
                    })
                    .sort((a, b) => {
                        // Önce en çok arananlar, sonra alfabetik
                        if (b.searchCount !== a.searchCount) {
                            return b.searchCount - a.searchCount;
                        }
                        return a.description.localeCompare(b.description);
                    })
                    .slice(0, 20); // İlk 20 sonuç

                // Erişim istatistiklerini güncelle
                results.forEach(food => {
                    this.updateAccessStats(food.fdcId);
                });

                resolve(results);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Erişim istatistiklerini güncelle
    async updateAccessStats(fdcId) {
        if (!this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(fdcId);

            request.onsuccess = () => {
                const food = request.result;
                if (food) {
                    food.searchCount = (food.searchCount || 0) + 1;
                    food.lastAccessed = Date.now();
                    store.put(food);
                }
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Süresi dolmuş cache'leri temizle
    async cleanExpired() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('cachedAt');
            const request = index.getAll();
            const now = Date.now();
            let deletedCount = 0;

            request.onsuccess = () => {
                const allFoods = request.result;
                const deletePromises = [];

                allFoods.forEach(food => {
                    const age = now - food.cachedAt;
                    if (age > this.cacheTTL) {
                        deletePromises.push(
                            new Promise((res) => {
                                const deleteRequest = store.delete(food.fdcId);
                                deleteRequest.onsuccess = () => {
                                    deletedCount++;
                                    res();
                                };
                                deleteRequest.onerror = () => res();
                            })
                        );
                    }
                });

                Promise.all(deletePromises).then(() => {
                    console.log(`🧹 ${deletedCount} süresi dolmuş besin temizlendi`);
                    resolve(deletedCount);
                });
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Cache boyutunu kontrol et ve gerekiyorsa en az kullanılanları sil
    async manageCacheSize() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.count();

            request.onsuccess = () => {
                const count = request.result;

                if (count > this.maxCacheSize) {
                    // En az kullanılanları sil
                    const getAllRequest = store.index('searchCount').getAll();
                    
                    getAllRequest.onsuccess = () => {
                        const allFoods = request.result;
                        // En az arananları sırala
                        allFoods.sort((a, b) => a.searchCount - b.searchCount);
                        
                        // Fazla olanları sil
                        const toDelete = allFoods.slice(0, count - this.maxCacheSize);
                        let deleted = 0;

                        toDelete.forEach(food => {
                            const deleteRequest = store.delete(food.fdcId);
                            deleteRequest.onsuccess = () => {
                                deleted++;
                                if (deleted === toDelete.length) {
                                    console.log(`🗑️ ${deleted} az kullanılan besin temizlendi`);
                                    resolve(deleted);
                                }
                            };
                        });

                        if (toDelete.length === 0) resolve(0);
                    };
                } else {
                    resolve(0);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Besin sil
    async deleteFood(fdcId) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(fdcId);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Cache istatistikleri
    async getStats() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const foods = request.result;
                const now = Date.now();
                
                const stats = {
                    total: foods.length,
                    expired: 0,
                    valid: 0,
                    totalSearches: 0,
                    oldestCache: null,
                    newestCache: null
                };

                let oldestTime = Infinity;
                let newestTime = 0;

                foods.forEach(food => {
                    const age = now - food.cachedAt;
                    
                    if (age > this.cacheTTL) {
                        stats.expired++;
                    } else {
                        stats.valid++;
                    }

                    stats.totalSearches += (food.searchCount || 0);

                    if (food.cachedAt < oldestTime) {
                        oldestTime = food.cachedAt;
                        stats.oldestCache = new Date(food.cachedAt);
                    }

                    if (food.cachedAt > newestTime) {
                        newestTime = food.cachedAt;
                        stats.newestCache = new Date(food.cachedAt);
                    }
                });

                resolve(stats);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Tüm cache'i temizle
    async clearAll() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('🗑️ Tüm cache temizlendi');
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Cache boyutu (MB) - Sadece foods store'unu hesapla
    async getCacheSize() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();

                request.onsuccess = () => {
                    const foods = request.result;
                    
                    // Her besin için JSON stringify ile boyut hesapla
                    let totalSize = 0;
                    foods.forEach(food => {
                        try {
                            const jsonString = JSON.stringify(food);
                            totalSize += new Blob([jsonString]).size; // Byte cinsinden
                        } catch (e) {
                            // JSON stringify hatası durumunda yaklaşık boyut hesapla
                            totalSize += 1000; // Varsayılan 1KB
                        }
                    });

                    const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
                    const sizeInKB = (totalSize / 1024).toFixed(2);

                    resolve({
                        used: sizeInMB, // MB
                        usedKB: sizeInKB, // KB (daha hassas)
                        count: foods.length,
                        quota: 'N/A', // Sadece cache boyutu, quota bilgisi yok
                        percentage: 'N/A'
                    });
                };

                request.onerror = () => {
                    reject(request.error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }
}

// Global instance
const foodCache = new FoodCache();

// Sayfa yüklendiğinde otomatik başlat ve temizlik yap
if (typeof window !== 'undefined') {
    window.addEventListener('load', async () => {
        try {
            await foodCache.init();
            // Süresi dolmuş cache'leri temizle
            await foodCache.cleanExpired();
            // Cache boyutunu yönet
            await foodCache.manageCacheSize();
        } catch (error) {
            console.error('Cache başlatma hatası:', error);
        }
    });
}

