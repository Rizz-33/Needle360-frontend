import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaFileAlt,
  FaMoneyBillWave,
  FaShoppingBag,
  FaStore,
  FaUsers,
} from "react-icons/fa";
import SideBarMenu, { useSidebar } from "../../components/ui/SideBarMenu";
import { useAdminStore } from "../../store/Admin.store";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useShopStore } from "../../store/Shop.store";

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { isExpanded } = useSidebar();
  const { unapprovedTailors, fetchUnapprovedTailors } = useAdminStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const { tailors, fetchTailors } = useShopStore();
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTailors: 0,
    pendingTailors: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentActivity: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Listen for sidebar expansion state changes
  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarExpanded(e.detail.expanded);
    };

    window.addEventListener("sidebarStateChange", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarStateChange", handleSidebarChange);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchCustomers(),
          fetchTailors(),
          fetchUnapprovedTailors(),
        ]);

        // Simulate fetching revenue and orders data
        const revenue = Math.floor(Math.random() * 50000) + 10000;
        const orders = Math.floor(Math.random() * 50) + 5;

        setStats((prev) => ({
          ...prev,
          totalRevenue: revenue,
          pendingOrders: orders,
        }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchCustomers, fetchTailors, fetchUnapprovedTailors]);

  // Update stats when data changes
  useEffect(() => {
    if (customers && tailors && unapprovedTailors) {
      setStats((prev) => ({
        ...prev,
        totalCustomers: customers.length,
        totalTailors: tailors.length,
        pendingTailors: unapprovedTailors.length,
        recentActivity: generateRecentActivity(),
      }));
    }
  }, [customers, tailors, unapprovedTailors]);

  const generateRecentActivity = () => {
    const activities = [];

    // Add customer activity if available
    if (customers.length > 0) {
      activities.push({
        id: 1,
        type: "new_customer",
        name: customers[0].name || "John Doe",
        time: "2 hours ago",
        icon: <FaUsers className="text-blue-500" />,
      });
    }

    // Add tailor activity if available
    if (tailors.length > 0) {
      activities.push({
        id: 2,
        type: "new_tailor",
        name: tailors[0].name || "Jane Smith",
        shop: tailors[0].shopName || "Tailor Shop",
        time: "5 hours ago",
        icon: <FaStore className="text-green-500" />,
      });
    }

    // Add order activity
    activities.push({
      id: 3,
      type: "order",
      description: "New order received",
      amount: "$245.00",
      time: "1 day ago",
      icon: <FaShoppingBag className="text-purple-500" />,
    });

    // Add payment activity
    activities.push({
      id: 4,
      type: "payment",
      description: "Payment processed",
      amount: "$1,245.00",
      time: "2 days ago",
      icon: <FaMoneyBillWave className="text-yellow-500" />,
    });

    return activities;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex w-full bg-blue-50">
      {/* Sidebar component */}
      <SideBarMenu />

      {/* Main content area that responds to sidebar state */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: isExpanded ? "calc(240px + 8px)" : "calc(60px + 8px)",
        }}
      >
        {/* Main content with padding to account for the header */}
        <main className="pt-24 pb-8 w-full px-12 overflow-auto h-screen">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {getGreeting()}, {user?.name || "Admin"}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your business today.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    icon: <FaUsers className="text-blue-500" size={20} />,
                    title: "Total Customers",
                    value: stats.totalCustomers,
                    change: "+5.2%",
                    trend: "up",
                  },
                  {
                    icon: <FaStore className="text-green-500" size={20} />,
                    title: "Total Tailors",
                    value: stats.totalTailors,
                    change: "+3.8%",
                    trend: "up",
                  },
                  {
                    icon: <FaFileAlt className="text-purple-500" size={20} />,
                    title: "Pending Tailors",
                    value: stats.pendingTailors,
                    change: stats.pendingTailors > 0 ? "+2" : "0",
                    trend: stats.pendingTailors > 0 ? "up" : "neutral",
                  },
                  {
                    icon: (
                      <FaMoneyBillWave className="text-yellow-500" size={20} />
                    ),
                    title: "Total Revenue",
                    value: `$${stats.totalRevenue.toLocaleString()}`,
                    change: "+12.5%",
                    trend: "up",
                  },
                  {
                    icon: <FaShoppingBag className="text-red-500" size={20} />,
                    title: "Pending Orders",
                    value: stats.pendingOrders,
                    change: "-2.5%",
                    trend: "down",
                  },
                  {
                    icon: <FaChartBar className="text-indigo-500" size={20} />,
                    title: "Monthly Growth",
                    value: "24%",
                    change: "+4.2%",
                    trend: "up",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        {stat.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : stat.trend === "down"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Content sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                    <button className="text-primary text-sm font-medium hover:text-primary-dark">
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start pb-4 border-b border-gray-100 last:border-0 group hover:bg-gray-50 px-2 -mx-2 py-2 rounded-lg transition-colors duration-150"
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors duration-150">
                          {activity.icon || <FaUsers className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          {activity.type === "new_customer" && (
                            <>
                              <p className="font-medium">
                                New customer registered
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.name} - {activity.time}
                              </p>
                            </>
                          )}
                          {activity.type === "new_tailor" && (
                            <>
                              <p className="font-medium">
                                New tailor registered
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.name} from {activity.shop} -{" "}
                                {activity.time}
                              </p>
                            </>
                          )}
                          {activity.type === "order" && (
                            <>
                              <p className="font-medium">
                                {activity.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                Amount: {activity.amount} - {activity.time}
                              </p>
                            </>
                          )}
                          {activity.type === "payment" && (
                            <>
                              <p className="font-medium">
                                {activity.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                Amount: {activity.amount} - {activity.time}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-6">Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Active Customers
                          </p>
                          <p className="text-2xl font-bold">
                            {Math.floor(stats.totalCustomers * 0.85)}
                          </p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                          <FaUsers size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Active Tailors
                          </p>
                          <p className="text-2xl font-bold">
                            {Math.floor(stats.totalTailors * 0.78)}
                          </p>
                        </div>
                        <div className="p-2 rounded-full bg-green-100 text-green-500">
                          <FaStore size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Completed Orders
                          </p>
                          <p className="text-2xl font-bold">
                            {Math.floor(stats.pendingOrders * 3.2)}
                          </p>
                        </div>
                        <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                          <FaShoppingBag size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Avg. Order Value
                          </p>
                          <p className="text-2xl font-bold">
                            $
                            {(
                              stats.totalRevenue /
                              (stats.pendingOrders * 3.2)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-500">
                          <FaMoneyBillWave size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
