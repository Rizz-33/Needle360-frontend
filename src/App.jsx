import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import FashionDesignTool from "./components/design/Tool";
import EmailVerification from "./pages/auth/EmailVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import Design from "./pages/Design";
import Home from "./pages/Home";
import OurServices from "./pages/Service";
import PendingApproval from "./pages/tailorshop/PendingApproval";
import { useAuthStore } from "./store/Auth.store";

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isApproved, isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace={false} />;
  }

  if (!isApproved) {
    return (
      <Navigate
        to="/pending-approval"
        state={{ from: location }}
        replace={false}
      />
    );
  }

  if (!user.isVerified) {
    return (
      <Navigate to="/verify-email" state={{ from: location }} replace={false} />
    );
  }

  return children;
};

// Component to redirect authenticated users away from login/signup pages
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (
    isAuthenticated &&
    user.isVerified &&
    (location.pathname === "/login" || location.pathname === "/signup")
  ) {
    const from = location.state?.from?.pathname || "/design";
    return <Navigate to={from} replace={true} />;
  }

  return children;
};

function App() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="max-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/design/*" element={<Design />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/design-tool" element={<FashionDesignTool />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
