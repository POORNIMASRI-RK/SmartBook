import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
    reducer:{
        cart: cartReducer,
        wishlist: wishlistReducer,
        user: userReducer,
        
    },
});

export default store;