// components/steps/ContentStep.jsx
import { motion } from "framer-motion";
import React from "react";
import ContentItemForm from "./ContentItemForm";
import ContentItemList from "./ContentItemList";

const ContentStep = ({
  components,
  editingComponent,
  newItemData,
  startEditing,
  handleNewItemChange,
  handleComponentImageUpload,
  addNewItem,
  setEditingComponent,
  setCurrentStep,
}) => {
  const enabledComponents = components.filter((comp) => comp.enabled);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Add Content</h2>

      {enabledComponents.length > 0 ? (
        <div className="space-y-8">
          {enabledComponents.map((component) => (
            <div key={component.id} className="border-b pb-6 last:border-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <span className="mr-2">{component.icon}</span>{" "}
                  {component.title}
                </h3>
                {!component.isClientGenerated && (
                  <button
                    onClick={() => startEditing(component.id)}
                    className="px-3 py-1 border border-primary text-primary rounded-full hover:bg-secondary/60 text-xs font-medium transition"
                  >
                    Add {component.title}
                  </button>
                )}
              </div>

              {/* Show existing items for this component */}
              <ContentItemList component={component} />

              {/* Form for adding new item */}
              {editingComponent === component.id &&
                !component.isClientGenerated && (
                  <ContentItemForm
                    component={component}
                    newItemData={newItemData}
                    handleNewItemChange={handleNewItemChange}
                    handleComponentImageUpload={handleComponentImageUpload}
                    addNewItem={addNewItem}
                    onCancel={() => setEditingComponent(null)}
                  />
                )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xs">
            You haven't selected any components yet
          </p>
          <button
            onClick={() => setCurrentStep(1)}
            className="mt-4 px-8 py-2 bg-primary text-white rounded-full hover:bg-blue-700 text-xs"
          >
            Go back to select components
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ContentStep;
