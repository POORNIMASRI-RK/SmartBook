import React, { useState }from 'react'
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import BuyNow from './BuyNow';


const Product = ({addToCart,cart}) => {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const navigate = useNavigate();
    const products = [
        {
            id: 1,
            name: "The Psylology of Money",
            price: 269,
            rating: "4.6 ★★★★⯪",
            age: "18 years and up",
            language: "English",
            image: "https://m.media-amazon.com/images/I/71XEsXS5RlL._SY342_.jpg",
        },
        {
            id: 2,
            name: "Don't Believe Everything You Think",
            price: 164,
            rating: "4.5 ★★★★⯪",
            age: "12 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/71l4V5QookL._SY342_.jpg",
        },
        {
            id: 3,
            name: "The Power of Your Subconscious",
            price: 119,
            rating: "4.4 ★★★★⯪",
            age: "16 Years and up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/71sBtM3Yi5L._SY342_.jpg",
        },
        {
            id: 4,
            name: "Read People Like a Book",
            price: 169,
            rating: "4.5 ★★★★⯪",
            age: "20 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/51eysN903mL._SY342_.jpg",
        },
        {
            id: 5,
            name: "Stop Letting Everything Affect You",
            price: 190,
            rating: "4.6 ★★★★⯪",
            age: "18 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/71sXWkc3YsL._SY342_.jpg",
        },
        {
            id: 6,
            name: "The Mountain is You",
            price: 221,
            rating: "4.5 ★★★★⯪",
            age: "12 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/61xivWmExiL._SY342_.jpg",
        },
        {
            id: 7,
            name: "The Alchemist",
            price: 239,
            rating: "4.6 ★★★★⯪",
            age: "12 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/617lxveUjYL._SY342_.jpg",
        },
        {
            id: 8,
            name: "A Nation of Idiots",
            price: 399,
            rating: "3.0 ★★★",
            age: "12 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/81KeOD++BBL._SY342_.jpg",
        },
        {
            id: 9,
            name: "Why I am An Atheist",
            price: 104,
            rating: "4.6 ★★★★⯪",
            image:"https://m.media-amazon.com/images/I/61MCDl9XbqL._SY342_.jpg",
        },
        {
            id: 10,
            name: "The Richest Mn in Babylong",
            price: 88,
            rating: "3.5 ★★★⯪☆",
            age: "12 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/71HX66uNvfL._SY342_.jpg",
        },
        {
            id: 11,
            name: "You can",
            price: 93,
            rating: "4.4 ★★★★⯪",
            age: "12 Years and Up",
            language: "English",
            image:"https://m.media-amazon.com/images/I/81T05w0B3lL._SY342_.jpg",
        },
            
            
    ];
    return (
        <>
        <Navbar cartCount = {cartCount} />
        <section className='bg-gray-100 px-3 py-4'>
            <h1 className='text-xl font-semibold text-center mb-4'>Our Book's</h1>
            <div className='grid grid-cols-5 gap-5'>
                {products.map((prod)=>{
                    return(
                        <div key = {prod.id} className='bg-white p-4 rounded-lg shadow-md flex-col items-center gap-3 cursor-pointer'>
                            <img src = {prod.image} alt = {prod.name}className='h-[300px] item-center' />
                            <div className='flex flex-col items-center gap-2 hover '>
                                <h2 className='font-semibold'>{prod.name}</h2>
                                <p>💰 {prod.price}</p>
                                <p>📈 {prod.rating}</p>
                                <p>👤 {prod.age}</p>
                                <p>🗣️ {prod.language}</p>
                                <button onClick={() => addToCart(prod)} className='bg-green-600 hover:bg-green-800 cursor-pointer items-center rounded py-1 px-2 gap-2'>Add to Cart</button>
                            <button onClick={() =>navigate("/BuyNow",{state:{ product: prod ,buyNow: true },})} className='bg-green-600 hover:bg-green-800 cursor-pointer items-center rounded py-1 px-2 '> Buy Book Now</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
        <Footer/>
        </>
    )
};
export default Product;
