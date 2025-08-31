import { ProductsState } from "@/types/database.types";
import { brandReducer } from "./brandReducer";
import { categoryReducer } from "./categoryReducer";
import { loadingReducer } from "./loadingReducer";
import { productReducer } from "./productReducer";
import { ProductAction } from "@/types/productAction";

const reducers = [productReducer, loadingReducer, categoryReducer, brandReducer];

export const productsReducer = (state: ProductsState, action: ProductAction) => {
    for (const reducer of reducers) {
        const newState = reducer(state, action);
        if (newState !== undefined) return newState;
    }
    return state;
};