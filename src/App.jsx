import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ChatPopup from "./components/chat/ChatPopup";
import FashionDesignTool from "./components/design/Tool";
import Loader from "./components/ui/Loader";
import { SidebarProvider } from "./components/ui/SideBarMenu";
import About from "./pages/About";
import AdminLogin from "./pages/admin/AdminLogin";
import CustomerManagement from "./pages/admin/CustomerManagement";
import Dashboard from "./pages/admin/Dashboard";
import TailorManagement from "./pages/admin/TailorManagement";
import TailorRequest from "./pages/admin/TailorRequest";
import UnauthorizedAccess from "./pages/admin/UnauthorizedPage";
import EmailVerification from "./pages/auth/EmailVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import Contact from "./pages/Contact";
import CheckoutPage from "./pages/customers/CheckoutPage";
import CustomerProfileSetup from "./pages/customers/CustomerProfileSetup";
import OrderDetails from "./pages/customers/OrderDetails";
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
  const { isAuthenticated, isApproved, user, checkAuth, checkApproval } =
    useAuthStore();
  const location = useLocation();

  const verifyAuth = useCallback(async () => {
    if (isAuthenticated && user) {
      // Skip checkAuth if already authenticated
      if (user.role !== 9 && !isApproved) {
        await checkApproval();
      }
      setIsInitialized(true);
      return;
    }

    try {
      await checkAuth();
      if (isAuthenticated && user?.role !== 9) {
        await checkApproval();
      }
    } catch (error) {
      console.error("Verification Error:", error);
    } finally {
      setIsInitialized(true);
    }
  }, [checkAuth, checkApproval, isAuthenticated, user, isApproved]);

  useEffect(() => {
    verifyAuth();
  }, [location.pathname, verifyAuth]);

  if (!isInitialized) {
    return <Loader />;
  }

  // Handle token in URL for Google auth callback
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const userParam = queryParams.get("user");

  if (token && userParam) {
    try {
      const userData = JSON.parse(decodeURIComponent(userParam));
      if (userData.isVerified) {
        localStorage.setItem("token", token);
        return children;
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (!isApproved && user.role !== 1) {
    return (
      <Navigate to="/pending-approval" state={{ from: location }} replace />
    );
  }

  return children;
};

// Component to protect admin routes
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
  }, [checkAuth, location.pathname]);

  if (!isInitialized) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
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

// Component to redirect authenticated users away from auth pages
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated && user?.isVerified) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

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
            path="/design"
            element={
              <ProtectedRoute>
                <Design />
              </ProtectedRoute>
            }
          />
          <Route path="/services" element={<OurServices />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/design-tool" element={<FashionDesignTool />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/profile-setup" element={<BusinessProfileSetup />} />
          <Route path="/edit-profile" element={<CustomerProfileSetup />} />
          <Route path="/checkout/:orderId" element={<OrderDetails />} />
          <Route path="/checkout/payment/:orderId" element={<CheckoutPage />} />
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
          <Route
            path="/user-management"
            element={
              <AdminProtectedRoute>
                <CustomerManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/tailor-management"
            element={
              <AdminProtectedRoute>
                <TailorManagement />
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
