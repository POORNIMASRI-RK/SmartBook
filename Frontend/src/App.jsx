import Product from './components/Product';
import Cart from "./components/Cart";
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import BuyNow from './components/BuyNow';
import OrderSuccess from './components/OrderSuccess';
import Wishlist from './components/Wishlist';
import SignUp from './components/Login/SignUp';
import SignIn from './components/Login/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { loginSuccess,logout } from './features/user/userSlice';
import { loadUserCart } from './features/cart/cartSlice';
import { loadUserWishlist } from './features/wishlist/wishlistSlice';
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminProducts from "./components/AdminProducts";
import OrderPage from './components/OrderPage';
import ProfilePage from './components/ProfilePage';

function App(){
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUserCart(user));
    dispatch(loadUserWishlist(user));
  }, [user, dispatch]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localstorage:", token);

      if(!token){
        return;
      }
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}users`,{
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });

        if(res.data.success && res.data.user){
          dispatch(
            loginSuccess({
              user: res.data.user,
              token: token,
            })
          );
        }
      }catch(err){
        // If backend fails (e.g. 401 because token is a Google OAuth token), check if token is a valid Google ID token
        try {
          const decoded = jwtDecode(token);
          if (decoded && decoded.email && (decoded.iss?.includes("google") || decoded.sub)) {
            const googleUser = {
              name: decoded.name || decoded.email.split("@")[0],
              email: decoded.email,
              role: "user",
              googleId: decoded.sub,
            };
            dispatch(
              loginSuccess({
                user: googleUser,
                token: token,
              })
            );
            return;
          }
        } catch (jwtErr) {
          // Token decoding failed or invalid JWT format
        }

        console.warn("Session token invalid or expired. Logging out.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
      }
    };
    fetchUserProfile();
  },[dispatch]);
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {< Product /> } /> 
          {/* <Route path = "/Cart" element = {< Cart />} /> */}
          <Route path="/wishlist" element={< Wishlist/>} />
          {/* <Route path = "/checkout" element = {< BuyNow/>}/> */}
          <Route path = "/Success" element = {< OrderSuccess/>}/>
          <Route path = "/success" element = {< OrderSuccess/>}/>
          <Route path = "/signup" element = {< SignUp />}/>
          <Route path = "/signin" element = { <SignIn />} />

          <Route element = { <ProtectedRoute />}>
            <Route path = "/cart" element = {<Cart/>}/>
            <Route path = "/checkout" element = {< BuyNow/>}/>
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/profile" element={<ProfilePage />} />

          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<OrderPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;