import { useState } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Product from './components/Product';
import Cart from "./components/Cart";
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import BuyNow from './components/BuyNow';
import OrderSuccess from './components/OrderSuccess';

function App(){
  const [cart, setCart] = useState([]);

   const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Product addToCart = {addToCart} cart = {cart}/>}/>
          <Route path = "/Cart" element = {<Cart cart={cart} setCart={setCart} />} />
          <Route path = "/BuyNow" element = {< BuyNow/>}/>
          <Route path = "/Success" element = {<OrderSuccess/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;