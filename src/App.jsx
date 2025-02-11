import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthStore } from "./store/Auth.store";

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);

  return (
    <div className="max-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
