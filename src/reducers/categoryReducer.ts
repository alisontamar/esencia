import { ProductsState } from "@/types/database.types";
import { ProductAction } from "@/types/productAction";
import { ProductActionType } from "@/types/ProductActionTypes";

export const categoryReducer = (state: ProductsState, action: ProductAction): ProductsState | undefined => {
  switch (action.type) {
    case ProductActionType.SET_CATEGORIES:
      return { ...state, categories: action.payload };

    case ProductActionType.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };

    case ProductActionType.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case ProductActionType.REMOVE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };

    default:
      return undefined;
  }
};
