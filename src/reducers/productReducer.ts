import { ProductsState } from "@/types/database.types";
import { ProductAction } from "@/types/productAction";
import { ProductActionType } from "@/types/ProductActionTypes";

export const productReducer = (state: ProductsState, action: ProductAction): ProductsState | undefined => {
  switch (action.type) {
    case ProductActionType.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false };

    case ProductActionType.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };

    case ProductActionType.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    
    case ProductActionType.SET_MOST_REQUESTED:
      return { ...state, mostRequestedProducts: action.payload };

    case ProductActionType.REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    default:
      return state;
  }
};
