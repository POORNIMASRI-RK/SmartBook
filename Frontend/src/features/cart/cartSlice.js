import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart");

const initialState = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

const saveCartToLocalStorage = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ADD TO CART
    addToCart(state, action) {
      const product = action.payload;
      const productId = product._id || product.id;

      const existing = state.items.find(
        (item) => (item._id || item.id) === productId
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      saveCartToLocalStorage(state.items);
    },

    // REMOVE PRODUCT FROM CART
    removeFromCart(state, action) {
      const targetId = action.payload;

      state.items = state.items.filter(
        (item) => (item._id || item.id) !== targetId
      );

      saveCartToLocalStorage(state.items);
    },

    // INCREASE QUANTITY
    increaseQuantity(state, action) {
      const targetId = action.payload;

      const item = state.items.find(
        (item) => (item._id || item.id) === targetId
      );

      if (item) {
        item.quantity += 1;
      }

      saveCartToLocalStorage(state.items);
    },

    // DECREASE QUANTITY
    decreaseQuantity(state, action) {
      const targetId = action.payload;

      const item = state.items.find(
        (item) => (item._id || item.id) === targetId
      );

      if (item) {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (item) => (item._id || item.id) !== targetId
          );
        }
      }

      saveCartToLocalStorage(state.items);
    },

    // REMOVE ONE ITEM
    clearItem(state, action) {
      const targetId = action.payload;

      state.items = state.items.filter(
        (item) => (item._id || item.id) !== targetId
      );

      saveCartToLocalStorage(state.items);
    },

    // CLEAR ENTIRE CART
    clearCart(state) {
      state.items = [];

      localStorage.removeItem("cart");
    },
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;