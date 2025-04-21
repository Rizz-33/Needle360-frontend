import React, { useEffect, useState } from "react";
import { FaBox, FaChartBar, FaCut, FaTag } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuthStore } from "../../../store/Auth.store";
import { useDesignStore } from "../../../store/Design.store";
import { useInventoryStore } from "../../../store/Inventory.store";
import { useOfferStore } from "../../../store/Offer.store";
import { useOrderStore } from "../../../store/Order.store";
import AvailabilityManagement from "./AvailabilityManagement";
import CustomerManagement from "./CustomerManagement";
import DesignManagement from "./DesignManagement";
import InventoryManagement from "./InventoryManagement";
import OfferManagement from "./OfferManagement";
import OrderManagement from "./OrderManagement";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import ServiceManagement from "./ServiceManagement";
import SideBarMenu, { SidebarProvider } from "./SideBarMenu";
import StatsCard from "./StatsCard";

const TailorDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const { user } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const { inventory, fetchInventory } = useInventoryStore();
  const { designs, fetchTailorDesignsById } = useDesignStore();
  const { offers, fetchOffersByTailorId } = useOfferStore();

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      fetchInventory();
      fetchTailorDesignsById(user.id);
      fetchOffersByTailorId(user.id);
    }
  }, [
    user,
    fetchOrders,
    fetchInventory,
    fetchTailorDesignsById,
    fetchOffersByTailorId,
  ]);

  const handleSidebarChange = (e) => {
    setSidebarExpanded(e.detail.expanded);
  };

  useEffect(() => {
    window.addEventListener("sidebarStateChange", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarStateChange", handleSidebarChange);
  }, []);

  const stats = [
    {
      icon: <FaChartBar className="text-blue-400 text-xl" />,
      title: "Total Orders",
      value: orders.length,
      change: "+5%",
      trend: "up",
    },
    {
      icon: <FaBox className="text-emerald-400 text-xl" />,
      title: "Inventory Items",
      value: inventory.length,
      change: "+2%",
      trend: "up",
    },
    {
      icon: <FaCut className="text-purple-400 text-xl" />,
      title: "Designs",
      value: designs.length,
      change: "+3%",
      trend: "up",
    },
    {
      icon: <FaTag className="text-amber-400 text-xl" />,
      title: "Active Offers",
      value: offers.length,
      change: "+1%",
      trend: "up",
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrderManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "designs":
        return <DesignManagement />;
      case "offers":
        return <OfferManagement />;
      case "services":
        return <ServiceManagement />;
      case "availability":
        return <AvailabilityManagement />;
      case "customers":
        return <CustomerManagement />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="bg-white rounded-xl shadow-sm p-4 lg:col-span-2 border border-gray-100 w-full overflow-x-auto">
              <RecentActivity />
            </div>
            <div className="w-full">
              <QuickActions setActiveSection={setActiveSection} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full bg-gray-50 min-h-screen font-inter overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-600"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <SidebarProvider>
        <SideBarMenu
          setActiveSection={setActiveSection}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </SidebarProvider>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 ${
          sidebarExpanded ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <main className="pt-6 pb-8 w-full px-4 md:px-6 overflow-y-auto h-screen">
          <div className="max-w-screen-2xl mx-auto">
            {activeSection === "overview" && (
              <>
                <div className="mb-6 px-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Welcome back, {user?.name}
                      </h1>
                      <p className="text-gray-500 mt-1 text-sm md:text-base">
                        Here's what's happening with your business today.
                      </p>
                    </div>
                    <div className="w-full md:w-auto">
                      <div className="relative max-w-md">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-full"
                        />
                        <svg
                          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-2">
                  {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                  ))}
                </div>
              </>
            )}

            <div className="px-2 w-full">{renderSection()}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TailorDashboard;
