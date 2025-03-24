import React from "react";

const ContentItemList = ({ component }) => {
  return (
    <div className="space-y-3 mb-4">
      {component.items.length > 0 ? (
        component.items.map((item, index) => (
          <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800 text-sm">
                {item.title ||
                  item.name ||
                  item.day ||
                  item.category ||
                  item.reviewer ||
                  item.street ||
                  `Item ${index + 1}`}
              </h4>
            </div>
            <div className="flex mt-2">
              {item.image && (
                <div className="w-16 h-16 rounded overflow-hidden mr-3">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-sm text-gray-600">
                {item.description ||
                  item.hours ||
                  item.comment ||
                  item.price ||
                  ""}
              </div>
            </div>
          </div>
        ))
      ) : component.isClientGenerated ? (
        <p className="text-gray-500 italic text-xs mb-4">
          Customers will be able to leave reviews on your profile
        </p>
      ) : (
        <p className="text-gray-500 italic text-xs mb-4">
          No {component.title.toLowerCase()} added yet
        </p>
      )}
    </div>
  );
};

export default ContentItemList;
