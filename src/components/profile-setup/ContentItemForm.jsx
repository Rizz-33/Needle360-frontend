import React from "react";

const ContentItemForm = ({
  component,
  newItemData,
  handleNewItemChange,
  handleComponentImageUpload,
  addNewItem,
  onCancel,
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-3">
      <h4 className="font-medium text-gray-800 mb-3">
        Add New {component.title.slice(0, -1)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {component.contentFields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "md:col-span-2" : ""}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === "text" && (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                value={newItemData[field.name] || ""}
                onChange={(e) =>
                  handleNewItemChange(field.name, e.target.value)
                }
              />
            )}
            {field.type === "textarea" && (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                rows="3"
                value={newItemData[field.name] || ""}
                onChange={(e) =>
                  handleNewItemChange(field.name, e.target.value)
                }
              ></textarea>
            )}
            {field.type === "image" && (
              <div>
                <div className="flex items-center">
                  <input
                    type="file"
                    id={`${component.id}-${field.name}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleComponentImageUpload(e, field.name)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(`${component.id}-${field.name}`)
                        .click()
                    }
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 text-sm"
                  >
                    Select Image
                  </button>
                  {newItemData[field.name] && (
                    <span className="ml-2 text-green-600 text-sm">
                      Image selected
                    </span>
                  )}
                </div>
                {newItemData[field.name] && (
                  <div className="mt-2 w-16 h-16 rounded overflow-hidden">
                    <img
                      src={newItemData[field.name]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          type="button"
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm"
          onClick={addNewItem}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ContentItemForm;
