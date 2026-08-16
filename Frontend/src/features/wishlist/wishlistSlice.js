import { createSlice } from "@reduxjs/toolkit";

const getWishlistStorageKey = (user) => {
  if (!user) {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const uid = parsed._id || parsed.id || parsed.email;
        if (uid) return `wishlist_${uid}`;
      }
    } catch (e) {}
    return "wishlist_guest";
  }
  const uid = user._id || user.id || user.email;
  return uid ? `wishlist_${uid}` : "wishlist_guest";
};

const loadInitialWishlist = () => {
  try {
    const key = getWishlistStorageKey(null);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveWishlistToLocalStorage = (items, user = null) => {
  const key = getWishlistStorageKey(user);
  localStorage.setItem(key, JSON.stringify(items));
};

const initialState = {
  items: loadInitialWishlist(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    // SYNC / LOAD USER SPECIFIC WISHLIST
    loadUserWishlist(state, action) {
      const user = action.payload;
      const key = getWishlistStorageKey(user);
      try {
        const stored = localStorage.getItem(key);
        state.items = stored ? JSON.parse(stored) : [];
      } catch (e) {
        state.items = [];
      }
    },

    addToWishlist(state, action) {
      const product = action.payload;
      const targetId = product._id || product.id;

      const existing = state.items.find(
        (item) => (item._id || item.id) === targetId
      );

      if (!existing) {
        state.items.push(product);
      }
      saveWishlistToLocalStorage(state.items);
    },

    removeFromWishlist(state, action) {
      const targetId = action.payload;
      state.items = state.items.filter(
        (item) => (item._id || item.id) !== targetId
      );
      saveWishlistToLocalStorage(state.items);
    },

    clearWishlist(state) {
      state.items = [];
      const key = getWishlistStorageKey(null);
      localStorage.removeItem(key);
    },
  },
});

export const { loadUserWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;