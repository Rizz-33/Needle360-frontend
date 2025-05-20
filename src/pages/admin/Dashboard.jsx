import { useEffect, useState } from "react";
import { FaCalendarAlt, FaChartBar, FaFileAlt, FaUsers } from "react-icons/fa";
import SideBarMenu, { useSidebar } from "../../components/ui/SideBarMenu";

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { isExpanded } = useSidebar();

  // Listen for sidebar expansion state changes
  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarExpanded(e.detail.expanded);
    };

    window.addEventListener("sidebarStateChange", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarStateChange", handleSidebarChange);
  }, []);

  return (
    <div className="flex w-full bg-blue-50">
      {/* Sidebar component */}
      <SideBarMenu />

      {/* Main content area that responds to sidebar state */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded ? "ml-[240px]" : "ml-[60px]"
        }`}
        style={{
          marginLeft: isExpanded ? "calc(240px + 8px)" : "calc(60px + 8px)",
        }}
      >
        {/* Main content with padding to account for the header */}
        <main className="pt-24 pb-8 w-full px-12 overflow-auto h-screen">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-600">
              Here's what's happening with your business today.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: <FaChartBar className="text-blue-500" />,
                title: "Total Revenue",
                value: "$24,345",
                change: "+2.5%",
              },
              {
                icon: <FaUsers className="text-green-500" />,
                title: "New Users",
                value: "1,245",
                change: "+3.2%",
              },
              {
                icon: <FaFileAlt className="text-purple-500" />,
                title: "Pending Orders",
                value: "42",
                change: "-0.5%",
              },
              {
                icon: <FaCalendarAlt className="text-orange-500" />,
                title: "Upcoming Events",
                value: "8",
                change: "+1.0%",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gray-100">{stat.icon}</div>
                  <span
                    className={`text-sm font-medium ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
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
              <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                      <FaUsers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New customer registered</p>
                      <p className="text-sm text-gray-500">
                        John Doe - 2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-500 text-sm font-medium">
                View all activity
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { title: "Create New User", icon: <FaUsers /> },
                  { title: "Process Orders", icon: <FaFileAlt /> },
                  { title: "Schedule Event", icon: <FaCalendarAlt /> },
                  { title: "View Reports", icon: <FaChartBar /> },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                      {action.icon}
                    </div>
                    <span className="font-medium">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
