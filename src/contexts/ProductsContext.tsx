import { createContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { AnalyticsService } from '@/lib/services/analytics';
import { BrandService } from '@/lib/services/brands';
import { CategoryService } from '@/lib/services/categories';
import { ProductService } from '@/lib/services/products';
import { Category, Brand, Product, MostRequestedProduct, CreateProductData, ConsultationData, ProductFilters, ProductsContextType, ProductByCategory } from '@/types/database.types';

// Tipos para el cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStore {
  [key: string]: CacheEntry<any>;
}

// Configuración del cache
const CACHE_CONFIG = {
  CATEGORIES: 5 * 60 * 1000, // 5 minutos
  BRANDS: 5 * 60 * 1000, // 5 minutos
  PRODUCTS: 2 * 60 * 1000, // 2 minutos
  MOST_REQUESTED: 10 * 60 * 1000, // 10 minutos
  PRODUCT_BY_ID: 5 * 60 * 1000, // 5 minutos
  PRODUCTS_BY_CATEGORY: 3 * 60 * 1000, // 3 minutos
  FILTERED_PRODUCTS: 1 * 60 * 1000, // 1 minuto para filtros
};

// Clase simple para manejar cache
class SimpleCache {
  private cache: CacheStore = {};

  generateKey(prefix: string, params?: any): string {
    if (!params) return prefix;
    try {
      const paramsString = JSON.stringify(params);
      return `${prefix}_${btoa(paramsString)}`;
    } catch {
      return `${prefix}_${Date.now()}`;
    }
  }

  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  get<T>(key: string): T | null {
    const entry = this.cache[key] as CacheEntry<T>;
    if (!entry) return null;
    
    if (this.isValid(entry)) {
      console.log(`📦 Cache hit: ${key}`);
      return entry.data;
    }
    
    delete this.cache[key];
    return null;
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.cache[key] = { data, timestamp: Date.now(), ttl };
    console.log(`💾 Cache set: ${key}`);
  }

  invalidate(pattern: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(pattern)) {
        delete this.cache[key];
        console.log(`🗑️ Cache invalidated: ${key}`);
      }
    });
  }

  clear(): void {
    const count = Object.keys(this.cache).length;
    this.cache = {};
    console.log(`🧹 Cache cleared: ${count} entries`);
  }

  cleanup(): void {
    let removed = 0;
    Object.keys(this.cache).forEach(key => {
      if (!this.isValid(this.cache[key])) {
        delete this.cache[key];
        removed++;
      }
    });
    if (removed > 0) console.log(`🧽 Cleanup: ${removed} expired entries`);
  }

  getStats() {
    const keys = Object.keys(this.cache);
    const total = keys.length;
    let valid = 0;
    keys.forEach(key => {
      if (this.isValid(this.cache[key])) valid++;
    });
    return { total, valid, expired: total - valid };
  }
}

// Create context
export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export default function ProductsProvider({ children }: { children: ReactNode }) {
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [mostRequestedProducts, setMostRequestedProducts] = useState<MostRequestedProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productsByCategory, setProductsByCategory] = useState<ProductByCategory[]>([]);
    
    // Cache manager
    const [cache] = useState(() => new SimpleCache());

    useEffect(() => {
        loadingData();
        
        // Cleanup automático cada 15 minutos
        const interval = setInterval(() => cache.cleanup(), 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [cache]);

    const loadingData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Intentar obtener categorías del cache
            let categories = cache.get<Category[]>('categories');
            if (!categories) {
                categories = await CategoryService.fetchCategories();
                cache.set('categories', categories, CACHE_CONFIG.CATEGORIES);
            }

            // Intentar obtener marcas del cache
            let brands = cache.get<Brand[]>('brands');
            if (!brands) {
                brands = await BrandService.fetchBrands();
                cache.set('brands', brands, CACHE_CONFIG.BRANDS);
            }

            // Intentar obtener productos del cache
            let productsRaw = cache.get<any[]>('products_raw');
            if (!productsRaw) {
                productsRaw = await ProductService.fetchProducts();
                cache.set('products_raw', productsRaw, CACHE_CONFIG.PRODUCTS);
            }

            // Procesar productos con nombres (tu lógica existente)
            const productsWithNames = productsRaw.map((p: any) => ({
                ...p,
                marca_nombre: brands.find(b => b.id === p.marca_id)?.nombre || '',
                categoria_nombre: categories.find(c => c.id === p.categoria_id)?.nombre || '',
            }));

            // Intentar obtener productos más solicitados del cache
            let mostRequestedProducts = cache.get<MostRequestedProduct[]>('most_requested');
            if (!mostRequestedProducts) {
                mostRequestedProducts = await AnalyticsService.fetchMostRequestedProducts();
                cache.set('most_requested', mostRequestedProducts, CACHE_CONFIG.MOST_REQUESTED);
            }

            setCategories(categories);
            setBrands(brands);
            setProducts(productsWithNames as Product[]);
            setMostRequestedProducts(mostRequestedProducts);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Product operations (tu lógica existente + cache)
    const fetchProducts = async (filters?: ProductFilters) => {
        try {
            setLoading(true);
            setError(null);

            const cacheKey = cache.generateKey('filtered_products', filters);
            let products = cache.get<Product[]>(cacheKey);
            
            if (!products) {
                products = await ProductService.productsOffer(filters);
                cache.set(cacheKey, products, CACHE_CONFIG.FILTERED_PRODUCTS);
            }
            
            setProducts(products as Product[]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProductById = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const cacheKey = `product_${id}`;
            let product = cache.get<Product>(cacheKey);
            
            if (!product) {
                product = await ProductService.fetchProductById(id);
                cache.set(cacheKey, product, CACHE_CONFIG.PRODUCT_BY_ID);
            }
            
            setSelectedProduct(product);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

const createProduct = async (data: CreateProductData) => {
    try {
        setLoading(true);
        setError(null);

        // 1. Crear el producto
        const product = await ProductService.createProduct(data);
        
        // 2. Invalidar TODO el cache relacionado
        cache.invalidate('products');
        cache.invalidate('filtered_products');
        cache.invalidate('products_raw');
        cache.invalidate('products_by_category');
        cache.invalidate('most_requested');
        
        // 3. ✅ CLAVE: Recargar los datos automáticamente
        await loadingData();
        
        console.log('✅ Producto creado y datos actualizados automáticamente');
        
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        }
    } finally {
        setLoading(false);
    }
};
    const fetchProductsByCategory = async () => {
        try {
            setLoading(true);
            setError(null);

            let products = cache.get<ProductByCategory[]>('products_by_category');
            
            if (!products) {
                products = await ProductService.fetchProductsByCategory();
                cache.set('products_by_category', products, CACHE_CONFIG.PRODUCTS_BY_CATEGORY);
            }
            
            setProductsByCategory(products as ProductByCategory[]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Category operations (tu lógica existente + cache)
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            let categories = cache.get<Category[]>('categories');
            
            if (!categories) {
                categories = await CategoryService.fetchCategories();
                cache.set('categories', categories, CACHE_CONFIG.CATEGORIES);
            }
            
            setCategories(categories);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (name: string, description?: string) => {
        try {
            setLoading(true);
            setError(null);

            const category = await CategoryService.createCategory(name, description);
            
            // Invalidar cache de categorías después de crear
            cache.invalidate('categories');
            
            setCategories([category!]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Brand operations (tu lógica existente + cache)
    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError(null);

            let brands = cache.get<Brand[]>('brands');
            
            if (!brands) {
                brands = await BrandService.fetchBrands();
                cache.set('brands', brands, CACHE_CONFIG.BRANDS);
            }
            
            setBrands(brands);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const createBrand = async (name: string, description?: string) => {
        try {
            setLoading(true);
            setError(null);

            const brand = await BrandService.createBrand(name, description);
            
            // Invalidar cache de marcas después de crear
            cache.invalidate('brands');
            
            setBrands([brand!]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const registerWhatsAppConsultation = async (productId: string, sessionData?: Partial<ConsultationData>) => {
        try {
            setLoading(true);
            setError(null);

            const isRegistered = await AnalyticsService.registerWhatsAppConsultation(productId, sessionData);
            if (isRegistered) {
                // Invalidar cache de productos más solicitados
                cache.invalidate('most_requested');
                setMostRequestedProducts([...mostRequestedProducts]);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Nuevas funciones para manejar cache
    const clearCache = useCallback(() => {
        cache.clear();
    }, [cache]);

    const getCacheStats = useCallback(() => {
        return cache.getStats();
    }, [cache]);

    const invalidateCache = useCallback((pattern: string) => {
        cache.invalidate(pattern);
    }, [cache]);

    const refreshData = useCallback(async () => {
        cache.clear();
        await loadingData();
    }, [cache]);

    return (
        <ProductsContext.Provider value={{
            // Tus estados existentes
            products,
            selectedProduct,
            productsByCategory,
            categories,
            brands,
            mostRequestedProducts,
            loading,
            error,
            // Tus funciones existentes
            fetchProducts,
            fetchProductById,
            createProduct,
            fetchCategories,
            createCategory,
            fetchBrands,
            createBrand,
            fetchProductsByCategory,
            registerWhatsAppConsultation,
            // Nuevas funciones de cache
            clearCache,
            getCacheStats,
            invalidateCache,
            refreshData,
        }}>
            {children}
        </ProductsContext.Provider>
    );
};