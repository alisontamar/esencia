import { supabase } from "@/model/createClient";
import { productsReducer } from "@/reducers";
import { ConsultationData, ProductsState } from "@/types/database.types";
import { ProductActionType } from "@/types/ProductActionTypes";
import { useCallback, useReducer } from "react";

export function useAnalytics({ initialState }: { initialState: ProductsState }) {
    const [state, dispatch] = useReducer(productsReducer, initialState);
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error?.message || `Error in ${operation}`;
        dispatch({ type: ProductActionType.SET_ERROR, payload: errorMessage });
    }, []);

    const fetchMostRequestedProducts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('v_productos_mas_solicitados')
                .select('*')
                .limit(20);

            if (error) throw error;

            dispatch({ type: ProductActionType.SET_MOST_REQUESTED, payload: data || [] });
        } catch (error) {
            handleError(error, 'fetchMostRequestedProducts');
        }
    }, [handleError]);

    const registerWhatsAppConsultation = useCallback(async (
        productId: string,
        sessionData?: Partial<ConsultationData>
    ): Promise<boolean> => {
        try {
            const { error } = await supabase.rpc('registrar_consulta_whatsapp', {
                p_producto_id: productId,
                p_ip_address: sessionData?.ip_address || null,
                p_user_agent: sessionData?.user_agent || navigator.userAgent,
                p_referrer: sessionData?.referrer || document.referrer,
                p_session_id: sessionData?.session_id || null,
            });

            if (error) throw error;

            return true;
        } catch (error) {
            handleError(error, 'registerWhatsAppConsultation');
            return false;
        }
    }, [handleError]);

    return {
        fetchMostRequestedProducts,
        registerWhatsAppConsultation,
        state,
    };
}