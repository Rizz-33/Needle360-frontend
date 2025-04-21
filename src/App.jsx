import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ChatPopup from "./components/chat/ChatPopUp";
import FashionDesignTool from "./components/design/Tool";
import { SidebarProvider } from "./components/ui/SideBarMenu";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import TailorRequest from "./pages/admin/TailorRequest";
import UnauthorizedAccess from "./pages/admin/UnauthorizedPage";
import EmailVerification from "./pages/auth/EmailVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import CustomerProfileSetup from "./pages/customers/CustomerProfileSetup";
import CustomerProfilePage from "./pages/customers/Profile";
import Design from "./pages/Design";
import Home from "./pages/Home";
import OurServices from "./pages/Service";
import BusinessProfileSetup from "./pages/tailorshop/BusinessProfileSetup";
import TailorDashboard from "./pages/tailorshop/dashboard/Dashboard";
import PendingApproval from "./pages/tailorshop/PendingApproval";
import TailorProfilePage from "./pages/tailorshop/Profile";
import { useAuthStore } from "./store/Auth.store";

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isApproved, isAuthenticated, user, checkAuth, checkApproval } =
    useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const verifyAuthAndApproval = async () => {
      try {
        // First check authentication
        const authResult = await checkAuth();

        // Then check approval status if authenticated
        if (authResult && authResult.user) {
          const approvalResult = await checkApproval();
        }
      } catch (error) {
        console.error("Verification Error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    verifyAuthAndApproval();
  }, []);

  // Wait for initialization before rendering
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace={false} />;
  }

  if (!user.isVerified && !isApproved) {
    return (
      <Navigate to="/verify-email" state={{ from: location }} replace={false} />
    );
  }

  if (!isApproved) {
    console.warn("User not approved, redirecting to pending approval");
    return (
      <Navigate
        to="/pending-approval"
        state={{ from: location }}
        replace={false}
      />
    );
  }

  return children;
};

// Component to protect admin routes that require authentication and admin role
const AdminProtectedRoute = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Admin Auth Verification Error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    verifyAuth();
  }, [checkAuth]); // Add checkAuth as a dependency

  // Wait for initialization before rendering
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin-login" state={{ from: location }} replace={false} />
    );
  }

  if (!user || user.role !== 9) {
    return (
      <div className="min-h-screen w-full to-violet-50 flex flex-col items-center justify-center p-4">
        <UnauthorizedAccess />
      </div>
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

// App.jsx
function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="max-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      <ChatPopup />
      <SidebarProvider>
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
          <Route
            path="/design/*"
            element={
              <ProtectedRoute>
                <Design />
              </ProtectedRoute>
            }
          />
          <Route path="/services" element={<OurServices />} />
          <Route path="/design-tool" element={<FashionDesignTool />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/profile-setup" element={<BusinessProfileSetup />} />
          <Route path="/edit-profile" element={<CustomerProfileSetup />} />
          <Route
            path="/tailor-dashboard"
            element={
              <ProtectedRoute>
                <TailorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tailor/:id"
            element={
              <ProtectedRoute>
                <TailorProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/pending-tailors"
            element={
              <AdminProtectedRoute>
                <TailorRequest />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}

export default App;
