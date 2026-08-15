import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items :[],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers:{
        addToWishlist(state, action){
            const product = action.payload;
            const targetId = product._id || product.id;

            const existing = state.items.find(
                (item) => (item._id || item.id) === targetId
            );

            if(!existing){
                state.items.push(product);
            }
        },
        removeFromWishlist(state, action){
            const targetId = action.payload;
            state.items = state.items.filter(
                (item) => (item._id || item.id) !== targetId
            );
        },
    }
})

export const { addToWishlist, removeFromWishlist} = wishlistSlice.actions;

export default wishlistSlice.reducer;