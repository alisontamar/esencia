import { createContext, ReactNode, useEffect, useState } from 'react';
import { AnalyticsService } from '@/lib/services/analytics';
import { BrandService } from '@/lib/services/brands';
import { CategoryService } from '@/lib/services/categories';
import { ProductService } from '@/lib/services/products';
import { Category, Brand, Product, MostRequestedProduct, CreateProductData, ConsultationData, ProductFilters, ProductsContextType, ProductByCategory } from '@/types/database.types';


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
    useEffect(() => {
        loadingData();
    }, []);

    const loadingData = async () => {
  const categories = await CategoryService.fetchCategories();
  const brands = await BrandService.fetchBrands();

  // Traer productos con nombre de marca y categoría
  const productsRaw = await ProductService.fetchProducts();
  const productsWithNames = productsRaw.map((p: any) => ({
    ...p,
    marca_nombre: brands.find(b => b.id === p.marca_id)?.nombre || '',
    categoria_nombre: categories.find(c => c.id === p.categoria_id)?.nombre || '',
  }));

  const mostRequestedProducts = await AnalyticsService.fetchMostRequestedProducts();

  setCategories(categories);
  setBrands(brands);
  setProducts(productsWithNames as Product[]);
  setMostRequestedProducts(mostRequestedProducts);
  setLoading(false);
};


    // Product operations
    const fetchProducts = async (filters?: ProductFilters) => {
        try {
            setLoading(true);
            setError(null);

            const products = await ProductService.productsOffer(filters);
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

            const product = await ProductService.fetchProductById(id);
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

            const product = await ProductService.createProduct(data);
            setProducts([product as Product]);
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

            const products = await ProductService.fetchProductsByCategory();
            setProductsByCategory(products as ProductByCategory[]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Category operations
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const categories = await CategoryService.fetchCategories();
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
            setCategories([category!]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Brand operations
    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError(null);

            const brands = await BrandService.fetchBrands();
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

    return (
        <ProductsContext.Provider value={
            {
                products,
                selectedProduct,
                productsByCategory,
                categories,
                brands,
                mostRequestedProducts,
                loading,
                error,
                fetchProducts,
                fetchProductById,
                createProduct,
                fetchCategories,
                createCategory,
                fetchBrands,
                createBrand,
                fetchProductsByCategory,
                registerWhatsAppConsultation,

            }
        }>
            {children}
        </ProductsContext.Provider>
    );
};

