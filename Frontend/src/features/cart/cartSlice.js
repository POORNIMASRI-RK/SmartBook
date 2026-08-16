import { createSlice } from "@reduxjs/toolkit";

const getCartStorageKey = (user) => {
  if (!user) {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const uid = parsed._id || parsed.id || parsed.email;
        if (uid) return `cart_${uid}`;
      }
    } catch (e) {}
    return "cart_guest";
  }
  const uid = user._id || user.id || user.email;
  return uid ? `cart_${uid}` : "cart_guest";
};

const loadInitialCart = () => {
  try {
    const key = getCartStorageKey(null);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveCartToLocalStorage = (items, user = null) => {
  const key = getCartStorageKey(user);
  localStorage.setItem(key, JSON.stringify(items));
};

const initialState = {
  items: loadInitialCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // SYNC / LOAD USER SPECIFIC CART
    loadUserCart(state, action) {
      const user = action.payload;
      const key = getCartStorageKey(user);
      try {
        const stored = localStorage.getItem(key);
        state.items = stored ? JSON.parse(stored) : [];
      } catch (e) {
        state.items = [];
      }
    },

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
      const key = getCartStorageKey(null);
      localStorage.removeItem(key);
    },
  },
});

export const {
  loadUserCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;