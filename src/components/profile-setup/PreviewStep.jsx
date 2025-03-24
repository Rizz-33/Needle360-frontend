import React from "react";
import { FaPortrait } from "react-icons/fa";

const PreviewStep = ({
  profileImage,
  businessName,
  bio,
  components,
  saveSuccess,
  saveError,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Profile Preview</h2>

        {/* Save status messages */}
        {saveSuccess && (
          <div className="text-green-500 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
            Profile saved successfully!
          </div>
        )}

        {saveError && (
          <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
            Error: {saveError}
          </div>
        )}
      </div>

      <div className="bg-gray-100 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            {/* Profile Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl text-primary/20">
                  <FaPortrait />
                </span>
              )}
            </div>

            {/* Business Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">
                {businessName || "Your Business Name"}
              </h3>

              <div className="flex justify-between items-start w-full">
                {/* Business Bio */}
                <p className="text-gray-600 text-xs max-w-xs break-words line-clamp-2">
                  {bio ||
                    "Your business bio will appear here. Add a compelling description to attract customers."}
                </p>

                {/* Rating Section */}
                {components.find((c) => c.id === "reviews" && c.enabled) && (
                  <div className="flex items-center border border-primary px-4 py-1 rounded-full self-end">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-xs font-medium">No ratings yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Display enabled components in modern cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components
              .filter((c) => c.enabled)
              .map((component) => (
                <div
                  key={component.id}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="text-xs flex items-center text-gray-800 mb-3 border-b pb-2">
                    <span className="mr-2">{component.icon}</span>{" "}
                    {component.title}
                  </h4>

                  {component.id === "reviews" &&
                  component.items.length === 0 ? (
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-gray-600 text-sm">
                        Customers will be able to leave reviews here
                      </p>
                    </div>
                  ) : component.items.length > 0 ? (
                    <div className="space-y-3">
                      {component.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex border-b pb-3 last:border-0 last:pb-0"
                        >
                          {item.image && (
                            <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h5 className="font-semibold text-sm text-gray-800">
                              {item.title ||
                                item.name ||
                                item.day ||
                                item.category ||
                                item.reviewer ||
                                item.street ||
                                ""}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description ||
                                item.hours ||
                                item.comment ||
                                item.price ||
                                ""}
                            </p>
                            {item.rating && (
                              <div className="flex items-center mt-1">
                                {Array.from({
                                  length: parseInt(item.rating),
                                }).map((_, i) => (
                                  <span key={i} className="text-yellow-400">
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs italic">
                      No {component.title.toLowerCase()} added yet
                    </p>
                  )}
                </div>
              ))}

            {components.filter((c) => c.enabled).length === 0 && (
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">
                  Select components to display on your profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
