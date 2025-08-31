import { useProducts } from '@/hooks/useProducts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useBrand } from '@/hooks/useBrand';
import { useCategory } from '@/hooks/useCategory';
import { useOffer } from '@/hooks/useOffer';
import { ProductsContextType, ProductsState } from '@/types/database.types';
import React, { createContext, useCallback, ReactNode } from 'react';

const initialState: ProductsState = {
    products: [],
    categories: [],
    brands: [],
    mostRequestedProducts: [],
    loading: false,
    error: null,
};


// Create context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { fetchProducts, fetchProductById, createProduct, updateProduct, deleteProduct, state:stateProduct } = useProducts({ initialState });
    const { fetchCategories, createCategory, updateCategory, deleteCategory, state:stateCategory } = useCategory({ initialState });
    const { fetchBrands, createBrand, updateBrand, deleteBrand, state:stateBrand } = useBrand({ initialState });
    const { createOffer, updateOffer, deleteOffer, state:stateOffer } = useOffer({ initialState });
    const { fetchMostRequestedProducts, registerWhatsAppConsultation } = useAnalytics({ initialState });

    const refreshData = useCallback(async () => {
        await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchBrands(),
            fetchMostRequestedProducts(),
        ]);
    }, [fetchProducts, fetchCategories, fetchBrands, fetchMostRequestedProducts]);

    const state = stateProduct || stateCategory || stateBrand || stateOffer;
    const value: ProductsContextType = {
        // State
        products: state.products,
        categories: state.categories,
        brands: state.brands,
        mostRequestedProducts: state.mostRequestedProducts,
        loading: state.loading,
        error: state.error,

        // Product operations
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,

        // Category operations
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,

        // Brand operations
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,

        // Offer operations
        createOffer,
        updateOffer,
        deleteOffer,

        // Analytics
        fetchMostRequestedProducts,
        registerWhatsAppConsultation,

        refreshData,
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
};

