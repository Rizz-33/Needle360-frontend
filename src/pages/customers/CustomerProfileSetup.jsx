import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPortrait,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { initialCustomerProfileComponents } from "../../configs/Profile.configs";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";

const ImageSlider = ({ images, placeholderImg }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-h-48 sm:max-h-64">
        <img
          src={images[currentImageIndex] || placeholderImg}
          alt={`Image ${currentImageIndex + 1}`}
          className="w-full h-auto max-h-48 sm:max-h-64 object-contain rounded-lg"
          onError={(e) => {
            e.target.src = placeholderImg;
            e.target.onerror = null;
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              disabled={currentImageIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
                currentImageIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/70"
              }`}
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === images.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
                currentImageIndex === images.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/70"
              }`}
              aria-label="Next image"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {images.length > 0
          ? currentImageIndex === 0
            ? "Final Product"
            : `Detail Image ${currentImageIndex}`
          : "No Images Available"}
      </p>
    </div>
  );
};

const CustomerProfileSetup = () => {
  const { customer, fetchCustomerById, updateCustomer } = useCustomerStore();
  const { user, isLoading } = useAuthStore();
  const {
    customerDesigns,
    fetchCustomerDesignsById,
    createCustomerDesign,
    updateCustomerDesign,
    deleteCustomerDesign,
  } = useDesignStore();
  const navigate = useNavigate();

  const [showWelcome, setShowWelcome] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [components, setComponents] = useState(
    initialCustomerProfileComponents
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [newItemData, setNewItemData] = useState({
    title: "",
    description: "",
    tags: [],
    images: [],
  });
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const placeholderImg = "/assets/placeholder-design.jpg";

  useEffect(() => {
    if (user && user._id) {
      fetchCustomerById(user._id);
      fetchCustomerDesignsById(user._id);
    }
  }, [user, fetchCustomerById, fetchCustomerDesignsById]);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setProfileImage(customer.profilePic || null);
      setBio(customer.bio || "");

      const updatedComponents = [...components];

      // Designs component
      const designsComp = updatedComponents.find(
        (comp) => comp.id === "designs"
      );
      if (designsComp) {
        designsComp.enabled = true;
        designsComp.items = customerDesigns || [];
      }

      // Reviews component
      const reviewsComp = updatedComponents.find(
        (comp) => comp.id === "reviews"
      );
      if (reviewsComp) {
        reviewsComp.enabled = true;
        reviewsComp.items = customer.reviews || [];
      }

      setComponents(updatedComponents);
    }
  }, [customer, customerDesigns]);

  const steps = [
    { id: "basics", title: "Basic Info" },
    { id: "components", title: "Components" },
    { id: "content", title: "Add Content" },
    { id: "preview", title: "Preview" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleComponentImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imagePromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(imagePromises).then((newImageURLs) => {
        setNewItemData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImageURLs],
        }));
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewItemData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEditItem = (item, componentId) => {
    setEditingItem(item);
    setEditingComponent(componentId);
    setNewItemData({
      title: item.title || "",
      description: item.description || "",
      tags: item.tags || [],
      images:
        item.imageURLs && item.imageURLs.length > 0
          ? item.imageURLs
          : item.imageUrl
          ? [item.imageUrl]
          : [],
    });
  };

  const handleDeleteItem = (itemId, componentId) => {
    setItemToDelete({ id: itemId, component: componentId });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete && user?._id) {
      try {
        if (itemToDelete.component === "designs") {
          await deleteCustomerDesign(user._id, itemToDelete.id);
          await fetchCustomerDesignsById(user._id);
        } else if (itemToDelete.component === "reviews") {
          const updatedData = {
            reviews: components
              .find((c) => c.id === "reviews")
              .items.filter((item) => item.id !== itemToDelete.id),
          };
          await updateCustomer(user._id, updatedData);
          await fetchCustomerById(user._id);
        }

        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting item:", error);
        setSaveError("Failed to delete item");
      }
    }
  };

  const toggleComponent = (id) => {
    setComponents(
      components.map((comp) =>
        comp.id === id ? { ...comp, enabled: !comp.enabled } : comp
      )
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSaveProfile();
      navigate("/user/" + user._id);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startEditing = (componentId) => {
    setEditingComponent(componentId);
    setNewItemData({
      title: "",
      description: "",
      tags: [],
      images: [],
    });
  };

  const handleNewItemChange = (fieldName, value) => {
    setNewItemData({
      ...newItemData,
      [fieldName]: value,
    });
  };

  const addNewItem = async () => {
    if (!editingComponent || !user?._id) return;

    try {
      if (editingComponent === "designs") {
        const designData = {
          title: newItemData.title,
          description: newItemData.description,
          tags: newItemData.tags,
          imageURLs: newItemData.images,
        };
        await createCustomerDesign(user._id, designData);
        await fetchCustomerDesignsById(user._id);
      } else if (editingComponent === "reviews") {
        const updatedData = {
          reviews: [
            ...(customer?.reviews || []),
            {
              id: Date.now().toString(),
              title: newItemData.title,
              description: newItemData.description,
              image: newItemData.images[0], // Reviews use single image
            },
          ],
        };
        await updateCustomer(user._id, updatedData);
        await fetchCustomerById(user._id);
      }

      setNewItemData({
        title: "",
        description: "",
        tags: [],
        images: [],
      });
      setEditingComponent(null);
    } catch (error) {
      console.error("Error adding new item:", error);
      setSaveError("Failed to add new item");
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !user._id) {
      setSaveError("User information not available");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updateData = {
        name: name,
        profilePic: profileImage,
        bio: bio,
      };

      await updateCustomer(user._id, updateData);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveError(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "basics":
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-shrink-0">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden bg-secondary/20 cursor-pointer relative group"
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-secondary">
                      <FaUpload className="h-24" />
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm">Change Photo</span>
                  </div>
                </div>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-center mt-2 text-xs text-gray-500">
                  Click to change
                </p>
              </div>

              <div className="flex-grow w-full">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full text-xs px-4 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-xs focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Tell others about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-2">
                <Loader />
              </div>
            )}
          </motion.div>
        );
      case "components":
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Customize Your Profile
            </h2>
            <p className="text-gray-600 mb-6 text-xs">
              Select which components to display on your profile
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component) => (
                <motion.div
                  key={component.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                    component.enabled
                      ? "border-secondary/20 bg-blue-50"
                      : "border-gray-200 hover:border-secondary"
                  }`}
                  onClick={() => toggleComponent(component.id)}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{component.icon}</span>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800 text-sm">
                        {component.title}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {component.isClientGenerated
                          ? "Let others leave reviews"
                          : `Show ${component.title.toLowerCase()} on your profile`}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        component.enabled ? "bg-primary/50" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        className="bg-white w-4 h-4 rounded-full shadow-md"
                        animate={{
                          x: component.enabled ? 16 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case "content":
        const enabledComponents = components.filter((comp) => comp.enabled);
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Add Content
            </h2>

            {enabledComponents.length > 0 ? (
              <div className="space-y-8">
                {enabledComponents.map((component) => (
                  <div
                    key={component.id}
                    className="border-b pb-6 last:border-0"
                  >
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

                    {component.items.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {component.items.map((item, index) => (
                          <div
                            key={item.id || item._id}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm">
                                  {item.title || `Item ${index + 1}`}
                                </h4>
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {item.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleEditItem(item, component.id)
                                  }
                                  className="text-xs text-primary hover:text-hoverAccent"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteItem(
                                      item.id || item._id,
                                      component.id
                                    )
                                  }
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="mt-2">
                              {component.id === "designs" ? (
                                <ImageSlider
                                  images={
                                    item.imageURLs && item.imageURLs.length > 0
                                      ? item.imageURLs
                                      : item.imageUrl
                                      ? [item.imageUrl]
                                      : []
                                  }
                                  placeholderImg={placeholderImg}
                                />
                              ) : (
                                <div className="flex">
                                  {(item.image || item.imageUrl) && (
                                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                                      <img
                                        src={item.image || item.imageUrl}
                                        alt={item.title || "Item"}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="text-sm text-gray-600">
                                    {item.description || ""}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : component.isClientGenerated ? (
                      <p className="text-gray-500 italic text-xs mb-4">
                        Others will be able to leave reviews on your profile
                      </p>
                    ) : (
                      <p className="text-gray-500 italic text-xs mb-4">
                        No {component.title.toLowerCase()} added yet
                      </p>
                    )}

                    {editingComponent === component.id &&
                      !component.isClientGenerated && (
                        <div className="bg-blue-50 p-4 rounded-lg mt-3">
                          <h4 className="font-medium text-gray-800 mb-3">
                            Add New {component.title.slice(0, -1)}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {component.contentFields.map((field) => (
                              <div
                                key={field.name}
                                className={
                                  field.type === "textarea"
                                    ? "md:col-span-2"
                                    : ""
                                }
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
                                      handleNewItemChange(
                                        field.name,
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                                {field.type === "textarea" && (
                                  <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    rows="3"
                                    value={newItemData[field.name] || ""}
                                    onChange={(e) =>
                                      handleNewItemChange(
                                        field.name,
                                        e.target.value
                                      )
                                    }
                                  ></textarea>
                                )}
                                {field.type === "select" && field.multiple && (
                                  <>
                                    <select
                                      multiple
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                      value={newItemData[field.name] || []}
                                      onChange={(e) =>
                                        handleNewItemChange(
                                          field.name,
                                          Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                          )
                                        )
                                      }
                                    >
                                      {field.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Hold Ctrl/Cmd to select multiple tags
                                    </div>
                                  </>
                                )}
                                {field.type === "image" && (
                                  <div>
                                    <div className="flex items-center">
                                      <input
                                        type="file"
                                        id={`${component.id}-${field.name}`}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleComponentImageUpload}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              `${component.id}-${field.name}`
                                            )
                                            .click()
                                        }
                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 text-sm"
                                      >
                                        Add Images
                                      </button>
                                      {newItemData.images.length > 0 && (
                                        <span className="ml-2 text-green-600 text-sm">
                                          {newItemData.images.length} image
                                          {newItemData.images.length > 1
                                            ? "s"
                                            : ""}{" "}
                                          selected
                                        </span>
                                      )}
                                    </div>
                                    {newItemData.images.length > 0 && (
                                      <div className="mt-2 grid grid-cols-2 gap-2">
                                        {newItemData.images.map(
                                          (image, index) => (
                                            <div
                                              key={index}
                                              className="relative w-full h-24 rounded overflow-hidden"
                                            >
                                              <img
                                                src={image}
                                                alt={`Selected ${index + 1}`}
                                                className="w-full h-full object-cover"
                                              />
                                              <button
                                                onClick={() =>
                                                  handleRemoveImage(index)
                                                }
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                                aria-label="Remove image"
                                              >
                                                <FaTimes className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )
                                        )}
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
                              onClick={() => {
                                setEditingComponent(null);
                                setNewItemData({
                                  title: "",
                                  description: "",
                                  tags: [],
                                  images: [],
                                });
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm"
                              onClick={addNewItem}
                              disabled={!newItemData.title}
                            >
                              Add
                            </button>
                          </div>
                        </div>
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
            {editingItem && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-sm text-primary font-semibold mb-4">
                    Edit {editingComponent === "designs" ? "Design" : "Review"}
                  </h3>
                  <div className="space-y-4">
                    {components
                      .find((c) => c.id === editingComponent)
                      ?.contentFields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          {field.type === "text" && (
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              value={newItemData[field.name] || ""}
                              onChange={(e) =>
                                handleNewItemChange(field.name, e.target.value)
                              }
                            />
                          )}
                          {field.type === "textarea" && (
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              rows="3"
                              value={newItemData[field.name] || ""}
                              onChange={(e) =>
                                handleNewItemChange(field.name, e.target.value)
                              }
                            />
                          )}
                          {field.type === "select" && field.multiple && (
                            <>
                              <select
                                multiple
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                value={newItemData[field.name] || []}
                                onChange={(e) =>
                                  handleNewItemChange(
                                    field.name,
                                    Array.from(
                                      e.target.selectedOptions,
                                      (option) => option.value
                                    )
                                  )
                                }
                              >
                                {field.options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <div className="text-xs text-gray-500 mt-1">
                                Please press CTRL/CMD to select multiple tags.
                              </div>
                            </>
                          )}
                          {field.type === "image" && (
                            <div>
                              <div className="flex items-center">
                                <input
                                  type="file"
                                  id="item-image-edit"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={handleComponentImageUpload}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    document
                                      .getElementById("item-image-edit")
                                      .click()
                                  }
                                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 text-sm"
                                >
                                  Add Images
                                </button>
                                {newItemData.images.length > 0 && (
                                  <span className="ml-2 text-green-600 text-sm">
                                    {newItemData.images.length} image
                                    {newItemData.images.length > 1
                                      ? "s"
                                      : ""}{" "}
                                    selected
                                  </span>
                                )}
                              </div>
                              {newItemData.images.length > 0 && (
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  {newItemData.images.map((image, index) => (
                                    <div
                                      key={index}
                                      className="relative w-full h-24 rounded overflow-hidden"
                                    >
                                      <img
                                        src={image}
                                        alt={`Selected ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                        aria-label="Remove image"
                                      >
                                        <FaTimes className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <CustomButton
                      text="Cancel"
                      color="accent"
                      hover_color="hoverAccent"
                      variant="outlined"
                      width="w-20"
                      height="h-9"
                      type="submit"
                      onClick={() => {
                        setEditingItem(null);
                        setEditingComponent(null);
                        setNewItemData({
                          title: "",
                          description: "",
                          tags: [],
                          images: [],
                        });
                      }}
                    />
                    <CustomButton
                      text="Save Changes"
                      color="primary"
                      hover_color="hoverAccent"
                      variant="filled"
                      width="w-28"
                      height="h-9"
                      type="submit"
                      onClick={async () => {
                        try {
                          if (editingComponent === "designs") {
                            const designData = {
                              title: newItemData.title,
                              description: newItemData.description,
                              tags: newItemData.tags,
                              imageURLs: newItemData.images,
                            };
                            await updateCustomerDesign(
                              user._id,
                              editingItem.id || editingItem._id,
                              designData
                            );
                            await fetchCustomerDesignsById(user._id);
                          } else if (editingComponent === "reviews") {
                            const updatedData = {
                              reviews: components
                                .find((c) => c.id === "reviews")
                                .items.map((item) =>
                                  item.id === editingItem.id
                                    ? {
                                        ...item,
                                        title: newItemData.title,
                                        description: newItemData.description,
                                        image: newItemData.images[0],
                                      }
                                    : item
                                ),
                            };
                            await updateCustomer(user._id, updatedData);
                            await fetchCustomerById(user._id);
                          }

                          setEditingItem(null);
                          setEditingComponent(null);
                          setNewItemData({
                            title: "",
                            description: "",
                            tags: [],
                            images: [],
                          });
                        } catch (error) {
                          console.error("Error updating item:", error);
                          setSaveError("Failed to update item");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-sm text-primary font-semibold mb-4">
                    Confirm Delete
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Are you sure you want to delete this{" "}
                    {itemToDelete?.component === "designs"
                      ? "design"
                      : "review"}
                    ? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <CustomButton
                      text="Cancel"
                      color="accent"
                      hover_color="hoverAccent"
                      variant="outlined"
                      width="w-20"
                      height="h-9"
                      type="submit"
                      onClick={() => setShowDeleteConfirm(false)}
                    />
                    <CustomButton
                      text="Delete"
                      color="danger"
                      hover_color="#8B0000"
                      variant="filled"
                      width="w-20"
                      height="h-9"
                      type="submit"
                      onClick={confirmDeleteItem}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      case "preview":
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Profile Preview
              </h2>

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

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {name || "Your Name"}
                    </h3>

                    <div className="flex justify-between items-start w-full">
                      <p className="text-gray-600 text-xs max-w-xs break-words line-clamp-2">
                        {bio ||
                          "Your bio will appear here. Add a description to let others know about you."}
                      </p>

                      {components.find(
                        (c) => c.id === "reviews" && c.enabled
                      ) && (
                        <div className="flex items-center border border-primary px-4 py-1 rounded-full self-end">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-xs font-medium">
                            No ratings yet
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

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
                              Others will be able to leave reviews here
                            </p>
                          </div>
                        ) : component.items.length > 0 ? (
                          <div className="space-y-3">
                            {component.items.map((item) => (
                              <div
                                key={item.id || item._id}
                                className="flex flex-col border-b pb-3 last:border-0 last:pb-0"
                              >
                                <div className="flex justify-between items-start">
                                  <h5 className="font-semibold text-sm text-gray-800">
                                    {item.title || ""}
                                  </h5>
                                </div>
                                {component.id === "designs" ? (
                                  <ImageSlider
                                    images={
                                      item.imageURLs &&
                                      item.imageURLs.length > 0
                                        ? item.imageURLs
                                        : item.imageUrl
                                        ? [item.imageUrl]
                                        : []
                                    }
                                    placeholderImg={placeholderImg}
                                  />
                                ) : (
                                  <div className="flex mt-2">
                                    {(item.image || item.imageUrl) && (
                                      <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                                        <img
                                          src={item.image || item.imageUrl}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="text-sm text-gray-600">
                                      {item.description || ""}
                                    </div>
                                  </div>
                                )}
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {item.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
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
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-auto w-full bg-gradient-to-br from-blue-50 via-secondary/20 to-blue-100">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="flex items-center justify-center min-h-screen absolute inset-0 z-10 bg-grid-gray-300/[0.2]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center px-6"
            >
              <motion.h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-hoverAccent bg-clip-text text-transparent"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: 1,
                  duration: 1.5,
                }}
              >
                Let's Get Started!
              </motion.h1>
              <motion.p
                className="mt-3 text-sm text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Let's make your customer profile
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: showWelcome ? 5 : 0, duration: 1 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Customer Profile Setup
            </h1>
            <p className="text-sm text-primary/40 mt-2">
              Customize how others see your profile
            </p>
          </div>

          {/* Stepper */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex-1 flex flex-col items-center"
                >
                  {/* Connector line */}
                  {index > 0 && (
                    <div
                      className={`absolute top-4 w-full h-1 -left-1/2 ${
                        index <= currentStep ? "bg-primary" : "bg-gray-200"
                      }`}
                    ></div>
                  )}

                  {/* Step circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                      index < currentStep
                        ? "bg-primary text-white text-sm"
                        : index === currentStep
                        ? "bg-primary text-white text-sm"
                        : "bg-gray-200 text-gray-600 text-xs"
                    }`}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </div>

                  {/* Step title */}
                  <div className="text-[10px] font-medium mt-1 text-center">
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 w-full">
            {currentStep > 0 ? (
              <CustomButton
                text="Back"
                color="accent"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-20"
                height="h-9"
                type="submit"
                onClick={prevStep}
              />
            ) : (
              <div className="w-20" /> // Placeholder to maintain alignment
            )}

            <CustomButton
              text={
                currentStep === steps.length - 1
                  ? isSaving
                    ? "Saving..."
                    : saveSuccess
                    ? "Saved!"
                    : "Save and Complete Setup"
                  : "Continue"
              }
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-1/3"
              height="h-9"
              type="button"
              disabled={isSaving}
              onClick={nextStep}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerProfileSetup;
