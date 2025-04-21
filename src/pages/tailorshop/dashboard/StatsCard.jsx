import React from "react";

const StatsCard = ({ icon, title, value, change, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 text-blue-400">{icon}</div>
      </div>
      <div
        className={`mt-4 flex items-center text-sm ${
          trend === "up" ? "text-green-500" : "text-red-500"
        }`}
      >
        <span>{change}</span>
        <span className="ml-1">
          {trend === "up" ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12 13a1 1 0 100-2H9v-1h2a1 1 0 100-2H9V7h2a1 1 0 100-2H9V4a1 1 0 10-2 0v1H5a1 1 0 100 2h2v1H5a1 1 0 100 2h2v1H5a1 1 0 100 2h2v1a1 1 0 102 0v-1h2a1 1 0 100-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
