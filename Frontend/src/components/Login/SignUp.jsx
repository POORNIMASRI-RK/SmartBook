import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/user/userSlice";
import { API_BASE_URL } from "../../api/config";

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!username.trim() || !email.trim() || !password.trim()) {
            setErrorMsg("Username, Email, and Password are required.");
            return;
        }

        try{
            const response = await axios.post(`${API_BASE_URL}/register`,{
                name: username.trim(),
                email: email.trim(),
                password: password.trim(),
            });

            console.log("Response: ", response.data);
            if(response.data.token){
                dispatch(
                    loginSuccess({
                        user: response.data.newUser,
                        token: response.data.token,
                    }),
                );
            }
            window.alert("User registered successfully");
            navigate("/");
        }catch(err){
            console.log(err);
            setErrorMsg(err.response?.data?.message || "Registration failed. Please check your information.");
        }
    };

    return ( <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7] px-4">
        <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
        >

        {/* Logo */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#5C3A21]">
                📚 PaperHaven
            </h1>

            <p className="text-gray-500 mt-2">
                Create your account and start exploring books!
            </p>

        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {errorMsg}
          </div>
        )}

        {/* Username */}
        <label htmlFor="username" className="block font-semibold text-[#5C3A21] mb-2">
            Username
        </label>

        <input 
            id="username" 
            type="text" 
            placeholder="Enter your username" 
            className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-[#D4A017]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <label htmlFor="email" className="block font-semibold text-[#5C3A21] mb-2">
            Email
        </label>

        <input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-[#D4A017]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label htmlFor="password" className="block font-semibold text-[#5C3A21] mb-2">
            Password
        </label>

        <input 
            id="password" 
            type="password" 
            placeholder="Create a password" 
            className="w-full border border-gray-300 px-4 py-3 mb-5 rounded-lg outline-none focus:ring-2 focus:ring-[#D4A017]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        {/* Sign Up */}
        <button type="submit" className="w-full bg-[#5C3A21] hover:bg-[#3E2615] text-white font-semibold py-3 rounded-lg transition">
            Create Account
        </button>

        {/* Google Sign Up */}
        <button 
            type="button" 
            className="w-full mt-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg transition"
            >
                🌐 Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">

        <hr className="flex-1 border-gray-300" />

        <span className="text-gray-500">
            or
        </span>

        <hr className="flex-1 border-gray-300" />

        </div>

        {/* Sign In */}
        <p className="text-center text-gray-600">

            Already have an account?{" "}

        <button type="button" onClick={() => navigate("/signin")} className="text-[#D4A017] font-bold hover:underline">
            Sign In
        </button>

        </p>

        </form>

    </div>

    );
};

export default SignUp;
