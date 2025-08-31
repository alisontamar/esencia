import { supabase } from "@/model/createClient";
import { productsReducer } from "@/reducers";
import { CreateProductData, Product, ProductFilters, ProductsState, ProductWithOffer } from "@/types/database.types";
import { ProductActionType } from "@/types/ProductActionTypes";
import { useCallback, useReducer } from "react";

export function useProducts({ initialState }: { initialState: ProductsState }) {
    const [state, dispatch] = useReducer(productsReducer, initialState);
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error?.message || `Error in ${operation}`;
        dispatch({ type: ProductActionType.SET_ERROR, payload: errorMessage });
    }, []);

    // Product operations
    const fetchProducts = useCallback(async (filters?: ProductFilters) => {
        try {
            dispatch({ type: ProductActionType.SET_LOADING, payload: true });
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            let query = supabase
                .from('v_productos_con_ofertas')
                .select('*');

            // Apply filters
            if (filters?.category) {
                query = query.eq('categoria_id', filters.category);
            }
            if (filters?.brand) {
                query = query.eq('marca_id', filters.brand);
            }
            if (filters?.onSale !== undefined) {
                query = query.eq('esta_en_oferta', filters.onSale);
            }
            if (filters?.featured !== undefined) {
                query = query.eq('es_destacado', filters.featured);
            }
            if (filters?.search) {
                query = query.ilike('nombre', `%${ filters.search }%`);
            }
            if (filters?.minPrice !== undefined) {
                query = query.gte('precio_actual', filters.minPrice);
            }
            if (filters?.maxPrice !== undefined) {
                query = query.lte('precio_actual', filters.maxPrice);
            }
            if (filters?.limit) {
                query = query.limit(filters.limit);
            }
            if (filters?.offset) {
                query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;

            dispatch({ type: ProductActionType.SET_PRODUCTS, payload: data || [] });
        } catch (error) {
            handleError(error, 'fetchProducts');
        }
    }, [handleError]);

    const fetchProductById = useCallback(async (id: string): Promise<ProductWithOffer | null> => {
        try {
            const { data, error } = await supabase
                .from('v_productos_con_ofertas')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            handleError(error, 'fetchProductById');
            return null;
        }
    }, [handleError]);

    const createProduct = useCallback(async (data: CreateProductData): Promise<Product | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data: product, error } = await supabase
                .from('productos')
                .insert([{
                    ...data,
                    cantidad: data.cantidad || 0,
                    moneda: data.moneda || 'BOB',
                    esta_en_oferta: data.esta_en_oferta || false,
                    es_destacado: data.es_destacado || false,
                }])
                .select()
                .single();

            if (error) throw error;

            // Fetch the updated product with offer details
            const productWithOffer = await fetchProductById(product.id);
            if (productWithOffer) {
                dispatch({ type: ProductActionType.ADD_PRODUCT, payload: productWithOffer });
            }

            return product;
        } catch (error) {
            handleError(error, 'createProduct');
            return null;
        }
    }, [handleError, fetchProductById]);

    const updateProduct = useCallback(async (id: string, data: Partial<CreateProductData>): Promise<Product | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data: product, error } = await supabase
                .from('productos')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Fetch the updated product with offer details
            const productWithOffer = await fetchProductById(id);
            if (productWithOffer) {
                dispatch({ type: ProductActionType.UPDATE_PRODUCT, payload: productWithOffer });
            }

            return product;
        } catch (error) {
            handleError(error, 'updateProduct');
            return null;
        }
    }, [handleError, fetchProductById]);

    const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { error } = await supabase
                .from('productos')
                .delete()
                .eq('id', id);

            if (error) throw error;

            dispatch({ type: ProductActionType.REMOVE_PRODUCT, payload: id });
            return true;
        } catch (error) {
            handleError(error, 'deleteProduct');
            return false;
        }
    }, [handleError]);

    return {
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        state,
    };
}