import { ProductsState } from "@/types/database.types";
import { ProductAction } from "@/types/productAction";
import { ProductActionType } from "@/types/ProductActionTypes";

export const brandReducer = (state: ProductsState, action: ProductAction): ProductsState | undefined => {
  switch (action.type) {
    case ProductActionType.SET_BRANDS:
      return { ...state, brands: action.payload };

    case ProductActionType.ADD_BRAND:
      return { ...state, brands: [...state.brands, action.payload] };

    case ProductActionType.UPDATE_BRAND:
      return {
        ...state,
        brands: state.brands.map(b =>
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case ProductActionType.REMOVE_BRAND:
      return {
        ...state,
        brands: state.brands.filter(b => b.id !== action.payload),
      };

    default:
      return state;
  }
};