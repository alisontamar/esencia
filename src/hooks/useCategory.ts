import { supabase } from "@/model/createClient";
import { productsReducer } from "@/reducers";
import { Category, ProductsState } from "@/types/database.types";
import { ProductActionType } from "@/types/ProductActionTypes";
import { useCallback, useReducer } from "react";

export function useCategory({ initialState }: { initialState: ProductsState }) {
    const [state, dispatch] = useReducer(productsReducer, initialState);
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error?.message || `Error in ${operation}`;
        dispatch({ type: ProductActionType.SET_ERROR, payload: errorMessage });
    }, []);

    // Category operations
    const fetchCategories = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('activa', true)
                .order('nombre');

            if (error) throw error;

            dispatch({ type: ProductActionType.SET_CATEGORIES, payload: data || [] });
        } catch (error) {
            handleError(error, 'fetchCategories');
        }
    }, [handleError]);

    const createCategory = useCallback(async (name: string, description?: string): Promise<Category | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data, error } = await supabase
                .from('categorias')
                .insert([{ nombre: name, descripcion: description }])
                .select()
                .single();

            if (error) throw error;

            dispatch({ type: ProductActionType.ADD_CATEGORY, payload: data });
            return data;
        } catch (error) {
            handleError(error, 'createCategory');
            return null;
        }
    }, [handleError]);

    const updateCategory = useCallback(async (id: string, name: string, description?: string): Promise<Category | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data, error } = await supabase
                .from('categorias')
                .update({ nombre: name, descripcion: description })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            dispatch({ type: ProductActionType.UPDATE_CATEGORY, payload: data });
            return data;
        } catch (error) {
            handleError(error, 'updateCategory');
            return null;
        }
    }, [handleError]);

    const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { error } = await supabase
                .from('categorias')
                .update({ activa: false })
                .eq('id', id);

            if (error) throw error;

            dispatch({ type: ProductActionType.REMOVE_CATEGORY, payload: id });
            return true;
        } catch (error) {
            handleError(error, 'deleteCategory');
            return false;
        }
    }, [handleError]);


    return {
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        state,
    };
}