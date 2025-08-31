import { supabase } from "@/model/createClient";
import { productsReducer } from "@/reducers";
import { CreateOfferData, Offer, ProductsState } from "@/types/database.types";
import { ProductActionType } from "@/types/ProductActionTypes";
import { useCallback, useReducer } from "react";
import { useProducts } from "@/hooks/useProducts";

export function useOffer({ initialState }: { initialState: ProductsState }) {
    const [state, dispatch] = useReducer(productsReducer, initialState);
    const { fetchProducts } = useProducts({ initialState });
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error?.message || `Error in ${operation}`;
        dispatch({ type: ProductActionType.SET_ERROR, payload: errorMessage });
    }, []);

    // Offer operations
    const createOffer = useCallback(async (data: CreateOfferData): Promise<Offer | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data: offer, error } = await supabase
                .from('ofertas')
                .insert([{
                    ...data,
                    fecha_inicio: data.fecha_inicio || new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;

            // Update the product to mark it as on sale
            await supabase
                .from('productos')
                .update({ esta_en_oferta: true })
                .eq('id', data.producto_id);

            // Refresh products to get updated offer information
            await fetchProducts();

            return offer;
        } catch (error) {
            handleError(error, 'createOffer');
            return null;
        }
    }, [handleError, fetchProducts]);

    const updateOffer = useCallback(async (id: string, data: Partial<CreateOfferData>): Promise<Offer | null> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            const { data: offer, error } = await supabase
                .from('ofertas')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Refresh products to get updated offer information
            await fetchProducts();

            return offer;
        } catch (error) {
            handleError(error, 'updateOffer');
            return null;
        }
    }, [handleError, fetchProducts]);

    const deleteOffer = useCallback(async (id: string): Promise<boolean> => {
        try {
            dispatch({ type: ProductActionType.SET_ERROR, payload: null });

            // Get the offer to know which product to update
            const { data: offer } = await supabase
                .from('ofertas')
                .select('producto_id')
                .eq('id', id)
                .single();

            const { error } = await supabase
                .from('ofertas')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update the product to mark it as not on sale
            if (offer) {
                await supabase
                    .from('productos')
                    .update({ esta_en_oferta: false })
                    .eq('id', offer.producto_id);
            }

            // Refresh products to get updated information
            await fetchProducts();

            return true;
        } catch (error) {
            handleError(error, 'deleteOffer');
            return false;
        }
    }, [handleError, fetchProducts]);



    return {
        createOffer,
        updateOffer,
        deleteOffer,
        state,
    };
}