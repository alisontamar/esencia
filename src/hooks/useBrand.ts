import { supabase } from "@/model/createClient";
import { productsReducer } from "@/reducers";
import { Brand, ProductsState } from "@/types/database.types";
import { ProductActionType } from "@/types/ProductActionTypes";
import { useCallback, useReducer } from "react";

export function useBrand({ initialState }: { initialState: ProductsState }) {
    const [state, dispatch] = useReducer(productsReducer, initialState);
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error?.message || `Error in ${operation}`;
        dispatch({ type: ProductActionType.SET_ERROR, payload: errorMessage });
    }, []);

    // Brand operations
    const fetchBrands = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('marcas')
                .select('*')
                .eq('activa', true)
                .order('nombre');

            if (error) throw error;

            dispatch({ type: ProductActionType.SET_BRANDS, payload: data || [] });
        } catch (error) {
            handleError(error, 'fetchBrands');
        }
    }, [handleError]);

    const createBrand = useCallback(async (name: string, description?: string): Promise<Brand | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data, error } = await supabase
                .from('marcas')
                .insert([{ nombre: name, descripcion: description }])
                .select()
                .single();

            if (error) throw error;

            dispatch({ type: ProductActionType.ADD_BRAND, payload: data });
            return data;
        } catch (error) {
            handleError(error, 'createBrand');
            return null;
        }
    }, [handleError]);

    const updateBrand = useCallback(async (id: string, name: string, description?: string): Promise<Brand | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data, error } = await supabase
                .from('marcas')
                .update({ nombre: name, descripcion: description })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            dispatch({ type: ProductActionType.UPDATE_BRAND, payload: data });
            return data;
        } catch (error) {
            handleError(error, 'updateBrand');
            return null;
        }
    }, [handleError]);

    const deleteBrand = useCallback(async (id: string): Promise<boolean> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { error } = await supabase
                .from('marcas')
                .update({ activa: false })
                .eq('id', id);

            if (error) throw error;

            dispatch({ type: ProductActionType.REMOVE_BRAND, payload: id });
            return true;
        } catch (error) {
            handleError(error, 'deleteBrand');
            return false;
        }
    }, [handleError]);



    return {
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,
        state,
    };
}