import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
let initialUser = null;
try {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    initialUser = JSON.parse(savedUser);
  }
} catch (e) {
  initialUser = null;
}

const initialState = { 
    user: initialUser,
    token: initialToken || null,
    isAuthenticated: !!(initialToken && initialUser)
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{

        loginSuccess:( state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            if(action.payload.token){
                localStorage.setItem("token", action.payload.token);
            }
            if(action.payload.user){
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            }
        },

        logout:(state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    }
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;