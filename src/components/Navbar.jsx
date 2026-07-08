import React from 'react'
import { useNavigate } from 'react-router-dom';

function Navbar({cartCount}){
    const navigate = useNavigate();
    return(
        <nav className="bg-green-600 text-white py-5">
            <div className="flex justify-between items-center px-3">
                <h1 className="font-bold uppercase text-xl">SmartBook</h1>

                <ul className="flex gap-5 font-semibold text-lg cursor-pointer">
                    <li className="hover:text-pink-900">Home</li>
                    <li className="hover:text-pink-900">Product</li>
                    <li className="hover:text-pink-900">About</li>
                    <li className="hover:text-pink-900">Contact</li>
                </ul>

                <button onClick={()=>navigate("/cart")} className="bg-white text-green-600 px-2 font-semibold rounded-lg cursor-pointer"> 🛍️cart : {cartCount}</button>
            </div>
        </nav>  
    );
}
export default Navbar;