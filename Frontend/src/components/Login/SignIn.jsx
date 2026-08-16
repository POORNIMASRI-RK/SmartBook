import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/user/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../api/config";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get("returnTo");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user"); // "user" or "admin"
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleLoginSuccess = async (credentialResponse) =>{
    try{
      const user = jwtDecode(credentialResponse.credential);
      console.log("Google user info:", user);
      dispatch(
        loginSuccess({
          token : credentialResponse.credential,
          user: { 
            email: user.email,
            name: user.name,
            role: "user",
          }
        })
      );
      navigate("/", { replace: true });
    }catch(err){
      console.error("Google login failed:", err);
      setErrorMsg("Google Sign-In failed.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and Password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data.token) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
          })
        );
      }
      
      const role = res.data.user?.role;
      window.alert(`Logged in successfully as ${role === 'admin' ? 'Admin' : 'User'}`);
      
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else if (role === "admin") {
        navigate("/admin/products", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
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
                Welcome back, book lover!
            </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              loginType === "user"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              loginType === "admin"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Admin Login 
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {errorMsg}
          </div>
        )}

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
            placeholder="Enter your password" 
            className="w-full border border-gray-300 px-4 py-3 mb-3 rounded-lg outline-none focus:ring-2 focus:ring-[#D4A017]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

        {/* Forgot Password */}
        <div className="text-right mb-5">
            <button type="button" className="text-sm text-[#8B5E34] hover:underline">
                Forgot Password?
            </button>

        </div>

        {/* Sign In */}
        <button type="submit" className="w-full bg-[#5C3A21] hover:bg-[#3E2615] text-white font-semibold py-3 rounded-lg transition" >
            Sign In
        </button>

        {/* Google Sign In */}
        <div className="flex justify-center mt-3">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              console.log("Google Login Failed");
              setErrorMsg("Google Sign-In failed or was cancelled.");
            }}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-300" />

            <span className="text-gray-500">
                or
            </span>

            <hr className="flex-1 border-gray-300" />

        </div>

        {/* Sign Up */}
        <p className="text-center text-gray-600">

            New to PaperHaven?{" "}

        <button  onClick={() => navigate("/signup")} className="text-[#D4A017] font-bold hover:underline">
            Create an account
        </button>

        </p>

        </form>

    </div>


    );
};

export default SignIn;
