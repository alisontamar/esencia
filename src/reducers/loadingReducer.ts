import { ProductsState } from "@/types/database.types";
import { ProductAction } from "@/types/productAction";
import { ProductActionType } from "@/types/ProductActionTypes";

export const loadingReducer = (state: ProductsState, action: ProductAction): ProductsState | undefined => {
  switch (action.type) {
    case ProductActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case ProductActionType.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};