import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaPortrait, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { initialProfileComponents } from "../../configs/Profile.configs";
import { useAuthStore } from "../../store/Auth.store";
import { useAvailabilityStore } from "../../store/Availability.store";
import { useDesignStore } from "../../store/Design.store";
import { useOfferStore } from "../../store/Offer.store";
import { useServiceStore } from "../../store/Service.store";
import { useShopStore } from "../../store/Shop.store";

const BusinessProfileSetup = () => {
  const { tailor, fetchTailorById, updateTailor } = useShopStore();
  const { user, isLoading } = useAuthStore();
  const {
    designs: designItems,
    fetchDesignsById,
    createDesign,
    updateDesign,
    deleteDesign,
  } = useDesignStore();
  const {
    offers,
    fetchOffersByTailorId,
    createOffer,
    updateOffer,
    deleteOffer,
  } = useOfferStore();
  const {
    availabilitySlots,
    fetchTailorAvailability,
    createBulkAvailability,
    updateBulkAvailability,
    deleteBulkAvailability,
    validateTimeFormat,
  } = useAvailabilityStore();
  const {
    services,
    isLoading: isServicesLoading,
    error: servicesError,
    fetchServices,
    addServices,
    updateServices,
    deleteServices,
    getLocalServices,
  } = useServiceStore();

  const navigate = useNavigate();

  const [showWelcome, setShowWelcome] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [components, setComponents] = useState(initialProfileComponents);
  const [currentStep, setCurrentStep] = useState(0);
  const [newItemData, setNewItemData] = useState({
    title: "",
    description: "",
    percentage: 0,
    startDate: "",
    endDate: "",
    day: "",
    from: "09:00",
    to: "17:00",
    isOpen: true,
    status: "available",
    image: null,
    price: "",
  });
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (user && user._id) {
      fetchTailorById(user._id);
      fetchDesignsById(user._id);
      fetchOffersByTailorId(user._id);
      fetchTailorAvailability(user._id);
      fetchServices(user._id);
    }
  }, [
    user,
    fetchTailorById,
    fetchDesignsById,
    fetchOffersByTailorId,
    fetchTailorAvailability,
    fetchServices,
  ]);

  useEffect(() => {
    if (tailor) {
      setBusinessName(tailor.shopName || "");
      setProfileImage(tailor.logoUrl || null);
      setBio(tailor.bio || "");

      const updatedComponents = [...components];

      // Address component
      if (tailor.shopAddress) {
        const addressComp = updatedComponents.find(
          (comp) => comp.id === "address"
        );
        if (addressComp) {
          addressComp.enabled = true;
          const addressString = tailor.shopAddress || "";
          addressComp.items = [
            {
              id: Date.now(),
              street: addressString,
              city: "",
              state: "",
              zip: "",
              country: "",
            },
          ];
        }
      }

      // Offers component
      const offersComp = updatedComponents.find((comp) => comp.id === "offers");
      if (offersComp) {
        offersComp.enabled = offers.length > 0;
        offersComp.items = offers.map((offer) => ({
          id: offer._id,
          title: offer.title || "",
          description: offer.description || "",
          percentage: offer.percentage || 0,
          startDate: offer.startDate
            ? new Date(offer.startDate).toISOString().split("T")[0]
            : "",
          endDate: offer.endDate
            ? new Date(offer.endDate).toISOString().split("T")[0]
            : "",
          image: offer.imageUrl || null,
        }));
      }

      // Designs component
      const designsComp = updatedComponents.find(
        (comp) => comp.id === "designs"
      );
      if (designsComp) {
        designsComp.enabled = designItems.length > 0;
        designsComp.items = designItems.map((design) => ({
          id: design._id,
          title: design.title || "",
          description: design.description || "",
          image: design.imageUrl || null,
          price: design.price || "",
        }));
      }

      // Availability component
      const availComp = updatedComponents.find(
        (comp) => comp.id === "availability"
      );
      if (availComp) {
        availComp.enabled = availabilitySlots.length > 0;
        availComp.items = availabilitySlots.map((avail) => ({
          id: avail._id || Date.now(),
          day: avail.day || "",
          from: avail.from || "09:00",
          to: avail.to || "17:00",
          isOpen: avail.isOpen !== false,
          status: avail.status || "available",
        }));
      }

      // Services component
      const servicesComp = components.find((comp) => comp.id === "services");
      if (servicesComp) {
        servicesComp.enabled = services.length > 0;
        servicesComp.items = services.map((service, index) => {
          if (typeof service === "string") {
            return {
              id: service, // Use the service string as ID
              title: service,
            };
          } else {
            return {
              id: service.id || `service-${index}`,
              title: service.title || "",
            };
          }
        });
      }

      setComponents(updatedComponents);
    }
  }, [tailor, designItems, offers, availabilitySlots, services]);

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

  const handleComponentImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItemData({
          ...newItemData,
          [fieldName]: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditItem = (item, componentId) => {
    setEditingItem(item);
    setEditingComponent(componentId);

    if (componentId === "designs") {
      setNewItemData({
        title: item.title,
        description: item.description,
        price: item.price,
        image: item.image,
      });
    } else if (componentId === "offers") {
      setNewItemData({
        title: item.title,
        description: item.description,
        percentage: item.percentage,
        startDate: item.startDate,
        endDate: item.endDate,
        image: item.image,
      });
    } else if (componentId === "availability") {
      setNewItemData({
        day: item.day,
        from: item.from || "09:00",
        to: item.to || "17:00",
        isOpen: item.isOpen !== false,
        status: item.status || "available",
      });
    } else if (componentId === "services") {
      // Extract the service name whether it's a string or object
      const serviceName = typeof item === "string" ? item : item.title || "";
      setNewItemData({
        title: serviceName,
        originalTitle: serviceName, // Keep track of original for updates
      });
    }
  };

  const handleDeleteItem = (itemId, componentId) => {
    setItemToDelete({ id: itemId, component: componentId });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete && user?._id) {
      try {
        if (itemToDelete.component === "designs") {
          await deleteDesign(user._id, itemToDelete.id);
        } else if (itemToDelete.component === "offers") {
          await deleteOffer(user._id, itemToDelete.id);
        } else if (itemToDelete.component === "availability") {
          await deleteBulkAvailability(user._id, [itemToDelete.id]);
          await fetchTailorAvailability(user._id);
        } else if (itemToDelete.component === "services") {
          // Get the service name to delete
          const serviceToDelete = services.find(
            (service) =>
              (typeof service === "string" && service === itemToDelete.id) ||
              (typeof service === "object" && service.title === itemToDelete.id)
          );

          if (serviceToDelete) {
            const serviceName =
              typeof serviceToDelete === "string"
                ? serviceToDelete
                : serviceToDelete.title;

            await deleteServices(user._id, [serviceName]);
            await fetchServices(user._id);
          }
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }
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
      navigate("/tailor/" + user._id);
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
      percentage: 0,
      startDate: "",
      endDate: "",
      day: "",
      from: "09:00",
      to: "17:00",
      isOpen: true,
      status: "available",
      image: null,
      price: "",
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
        const newDesign = {
          title: newItemData.title || "",
          description: newItemData.description || "",
          price: newItemData.price || "",
          imageURLs: newItemData.image ? [newItemData.image] : [],
        };

        await createDesign(user._id, newDesign);
        await fetchDesignsById(user._id);
      } else if (editingComponent === "offers") {
        const newOffer = {
          title: newItemData.title || "",
          description: newItemData.description || "",
          percentage: Number(newItemData.percentage) || 0,
          startDate: newItemData.startDate || new Date().toISOString(),
          endDate: newItemData.endDate || new Date().toISOString(),
          imageUrl: newItemData.image || null,
        };

        await createOffer(user._id, newOffer);
        await fetchOffersByTailorId(user._id);
      } else if (editingComponent === "availability") {
        if (!newItemData.day || !newItemData.from || !newItemData.to) {
          setSaveError("Day, opening time, and closing time are required");
          return;
        }

        if (
          !validateTimeFormat(newItemData.from) ||
          !validateTimeFormat(newItemData.to)
        ) {
          setSaveError(
            "Invalid time format. Please use HH:MM (24-hour format)"
          );
          return;
        }

        const newSlot = {
          day: newItemData.day,
          from: newItemData.from,
          to: newItemData.to,
          isOpen: newItemData.isOpen,
          status: "available",
        };

        await createBulkAvailability(user._id, [newSlot]);
        await fetchTailorAvailability(user._id);
      } else if (editingComponent === "services") {
        if (!newItemData.title.trim()) {
          setSaveError("Service name cannot be empty");
          return;
        }

        try {
          // Add the new service to the existing services
          await addServices(user._id, [newItemData.title.trim()]);
          await fetchServices(user._id);

          setNewItemData({
            title: "",
            description: "",
            percentage: 0,
            startDate: "",
            endDate: "",
            day: "",
            from: "09:00",
            to: "17:00",
            isOpen: true,
            status: "available",
            image: null,
            price: "",
          });
          setEditingComponent(null);
        } catch (error) {
          console.error("Error adding service:", error);
          setSaveError("Failed to add service");
        }
      } else {
        setComponents((prevComponents) =>
          prevComponents.map((comp) =>
            comp.id === editingComponent
              ? {
                  ...comp,
                  items: [...comp.items, { id: Date.now(), ...newItemData }],
                }
              : comp
          )
        );
      }

      setNewItemData({
        title: "",
        description: "",
        percentage: 0,
        startDate: "",
        endDate: "",
        day: "",
        from: "09:00",
        to: "17:00",
        isOpen: true,
        status: "available",
        image: null,
        price: "",
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
        shopName: businessName,
        logoUrl: profileImage,
        bio: bio,
      };

      const enabledComponents = components.filter(
        (comp) =>
          comp.enabled &&
          !["designs", "offers", "availability", "services"].includes(comp.id)
      );

      // Handle address component
      const addressComp = components.find((comp) => comp.id === "address");
      if (addressComp && addressComp.enabled && addressComp.items.length > 0) {
        updateData.shopAddress = addressComp.items[0].street;
      }

      await updateTailor(user._id, updateData);
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
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    className="w-full text-xs px-4 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                    placeholder="Tell customers about your business..."
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
              Select which components to display on your business profile
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
                          ? "Let customers leave reviews"
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
                            key={item.id}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm">
                                  {item.title ||
                                    item.name ||
                                    item.day ||
                                    item.category ||
                                    item.reviewer ||
                                    item.street ||
                                    `Item ${index + 1}`}
                                </h4>
                                {(component.id === "offers" ||
                                  component.id === "designs" ||
                                  component.id === "services") &&
                                  (item.price || item.percentage) && (
                                    <p className="text-xs font-medium text-primary mt-1">
                                      {component.id === "offers"
                                        ? `${item.percentage}% OFF`
                                        : `LKR ${item.price}`}
                                    </p>
                                  )}
                              </div>
                              {(component.id === "designs" ||
                                component.id === "offers" ||
                                component.id === "availability" ||
                                component.id === "services") && (
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
                                      handleDeleteItem(item.id, component.id)
                                    }
                                    className="text-xs text-red-600 hover:text-red-800"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex mt-2">
                              {item.image && (
                                <div className="w-16 h-16 rounded overflow-hidden mr-3">
                                  <img
                                    src={item.image}
                                    alt={item.title || "Item"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="text-sm text-gray-600">
                                {item.description ||
                                  (component.id === "availability" &&
                                    `${item.from} - ${item.to}`) ||
                                  item.comment ||
                                  ""}
                                {component.id === "offers" && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    {item.startDate &&
                                      `Starts: ${new Date(
                                        item.startDate
                                      ).toLocaleDateString()}`}
                                    {item.endDate &&
                                      ` | Ends: ${new Date(
                                        item.endDate
                                      ).toLocaleDateString()}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : component.isClientGenerated ? (
                      <p className="text-gray-500 italic text-xs mb-4">
                        Customers will be able to leave reviews on your profile
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
                            {component.id === "availability" ? (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Day
                                  </label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    value={newItemData.day || ""}
                                    onChange={(e) =>
                                      handleNewItemChange("day", e.target.value)
                                    }
                                  >
                                    <option value="">Select day</option>
                                    {daysOfWeek.map((day) => (
                                      <option key={day} value={day}>
                                        {day}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opening Time (24-hour)
                                  </label>
                                  <input
                                    type="time"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    value={newItemData.from}
                                    onChange={(e) =>
                                      handleNewItemChange(
                                        "from",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Closing Time (24-hour)
                                  </label>
                                  <input
                                    type="time"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    value={newItemData.to}
                                    onChange={(e) =>
                                      handleNewItemChange("to", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="isOpen"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    checked={newItemData.isOpen}
                                    onChange={(e) =>
                                      handleNewItemChange(
                                        "isOpen",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor="isOpen"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Available?
                                  </label>
                                </div>
                              </>
                            ) : (
                              component.contentFields.map((field) => (
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
                                  {field.type === "number" && (
                                    <input
                                      type="number"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                      value={newItemData[field.name] || ""}
                                      onChange={(e) =>
                                        handleNewItemChange(
                                          field.name,
                                          e.target.value
                                        )
                                      }
                                      min={
                                        field.name === "percentage"
                                          ? 0
                                          : undefined
                                      }
                                      max={
                                        field.name === "percentage"
                                          ? 100
                                          : undefined
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
                                  {field.type === "date" && (
                                    <input
                                      type="date"
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
                                  {field.type === "image" && (
                                    <div>
                                      <div className="flex items-center">
                                        <input
                                          type="file"
                                          id={`${component.id}-${field.name}`}
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleComponentImageUpload(
                                              e,
                                              field.name
                                            )
                                          }
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
                              ))
                            )}
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
                                  percentage: 0,
                                  startDate: "",
                                  endDate: "",
                                  day: "",
                                  from: "09:00",
                                  to: "17:00",
                                  isOpen: true,
                                  status: "available",
                                  image: null,
                                  price: "",
                                });
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm"
                              onClick={addNewItem}
                              disabled={
                                (editingComponent === "offers" &&
                                  (!newItemData.title ||
                                    !newItemData.description ||
                                    !newItemData.startDate ||
                                    !newItemData.endDate)) ||
                                (editingComponent === "availability" &&
                                  (!newItemData.day ||
                                    !newItemData.from ||
                                    !newItemData.to)) ||
                                (editingComponent === "services" &&
                                  !newItemData.title)
                              }
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
                    Edit{" "}
                    {editingComponent === "designs"
                      ? "Design"
                      : editingComponent === "offers"
                      ? "Offer"
                      : editingComponent === "availability"
                      ? "Availability"
                      : "Service"}
                  </h3>
                  <div className="space-y-4">
                    {editingComponent === "availability" ? (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Day
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={newItemData.day || ""}
                            onChange={(e) =>
                              handleNewItemChange("day", e.target.value)
                            }
                          >
                            <option value="">Select day</option>
                            {daysOfWeek.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Opening Time (24-hour)
                          </label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={newItemData.from}
                            onChange={(e) =>
                              handleNewItemChange("from", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Closing Time (24-hour)
                          </label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={newItemData.to}
                            onChange={(e) =>
                              handleNewItemChange("to", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isOpenEdit"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            checked={newItemData.isOpen}
                            onChange={(e) =>
                              handleNewItemChange("isOpen", e.target.checked)
                            }
                          />
                          <label
                            htmlFor="isOpenEdit"
                            className="ml-2 block text-xs text-gray-700"
                          >
                            Available?
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={newItemData.title || ""}
                            onChange={(e) =>
                              handleNewItemChange("title", e.target.value)
                            }
                          />
                        </div>
                        {editingComponent !== "services" && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {editingComponent === "designs"
                                  ? "Price"
                                  : "Percentage Off"}
                              </label>
                              <input
                                type={
                                  editingComponent === "designs" ||
                                  editingComponent === "services"
                                    ? "text"
                                    : "number"
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                value={
                                  editingComponent === "designs"
                                    ? newItemData.price || ""
                                    : newItemData.percentage || ""
                                }
                                onChange={(e) =>
                                  handleNewItemChange(
                                    editingComponent === "designs"
                                      ? "price"
                                      : "percentage",
                                    e.target.value
                                  )
                                }
                                min={
                                  editingComponent === "offers"
                                    ? "0"
                                    : undefined
                                }
                                max={
                                  editingComponent === "offers"
                                    ? "100"
                                    : undefined
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                rows="3"
                                value={newItemData.description || ""}
                                onChange={(e) =>
                                  handleNewItemChange(
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </>
                        )}
                        {editingComponent === "offers" && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <div className="relative">
                                <input
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                                  value={newItemData.startDate || ""}
                                  onChange={(e) =>
                                    handleNewItemChange(
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    colorScheme: "light",
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <div className="relative">
                                <input
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                                  value={newItemData.endDate || ""}
                                  onChange={(e) =>
                                    handleNewItemChange(
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    colorScheme: "light",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 my-2">
                              <button
                                type="button"
                                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                onClick={() => {
                                  const today = new Date();
                                  const endDate = new Date();
                                  endDate.setDate(today.getDate() + 7);
                                  handleNewItemChange(
                                    "startDate",
                                    today.toISOString().split("T")[0]
                                  );
                                  handleNewItemChange(
                                    "endDate",
                                    endDate.toISOString().split("T")[0]
                                  );
                                }}
                              >
                                7 Days
                              </button>
                              <button
                                type="button"
                                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                onClick={() => {
                                  const today = new Date();
                                  const endDate = new Date();
                                  endDate.setDate(today.getDate() + 30);
                                  handleNewItemChange(
                                    "startDate",
                                    today.toISOString().split("T")[0]
                                  );
                                  handleNewItemChange(
                                    "endDate",
                                    endDate.toISOString().split("T")[0]
                                  );
                                }}
                              >
                                30 Days
                              </button>
                              <button
                                type="button"
                                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                onClick={() => {
                                  const today = new Date();
                                  const endDate = new Date();
                                  endDate.setDate(today.getDate() + 90);
                                  handleNewItemChange(
                                    "startDate",
                                    today.toISOString().split("T")[0]
                                  );
                                  handleNewItemChange(
                                    "endDate",
                                    endDate.toISOString().split("T")[0]
                                  );
                                }}
                              >
                                90 Days
                              </button>
                            </div>
                          </>
                        )}
                        {editingComponent !== "services" && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Image
                            </label>
                            <div className="flex items-center">
                              <input
                                type="file"
                                id="item-image-edit"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleComponentImageUpload(e, "image")
                                }
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
                                Change Image
                              </button>
                              {newItemData.image && (
                                <span className="ml-2 text-green-600 text-sm">
                                  Image selected
                                </span>
                              )}
                            </div>
                            {newItemData.image && (
                              <div className="mt-2 w-full h-48 rounded overflow-hidden">
                                <img
                                  src={newItemData.image}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
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
                          percentage: 0,
                          startDate: "",
                          endDate: "",
                          day: "",
                          from: "09:00",
                          to: "17:00",
                          isOpen: true,
                          status: "available",
                          image: null,
                          price: "",
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
                            await updateDesign(user._id, editingItem.id, {
                              title: newItemData.title,
                              description: newItemData.description,
                              price: newItemData.price,
                              imageUrl:
                                newItemData.image || editingItem.imageUrl,
                            });
                          } else if (editingComponent === "offers") {
                            await updateOffer(user._id, editingItem.id, {
                              title: newItemData.title,
                              description: newItemData.description,
                              percentage: Number(newItemData.percentage) || 0,
                              startDate: newItemData.startDate,
                              endDate: newItemData.endDate,
                              imageUrl:
                                newItemData.image || editingItem.imageUrl,
                            });
                          } else if (editingComponent === "availability") {
                            if (
                              !validateTimeFormat(newItemData.from) ||
                              !validateTimeFormat(newItemData.to)
                            ) {
                              setSaveError(
                                "Invalid time format. Please use HH:MM (24-hour format)"
                              );
                              return;
                            }

                            await updateBulkAvailability(user._id, [
                              {
                                id: editingItem.id,
                                day: newItemData.day,
                                from: newItemData.from,
                                to: newItemData.to,
                                isOpen: newItemData.isOpen,
                                status: "available",
                              },
                            ]);

                            await fetchTailorAvailability(user._id);
                          } else if (editingComponent === "services") {
                            // Create a new array with the updated services
                            const updatedServices = services.map((service) => {
                              if (
                                (typeof service === "string" &&
                                  service === editingItem.title) ||
                                (typeof service === "object" &&
                                  service.title === editingItem.title)
                              ) {
                                return newItemData.title.trim();
                              }
                              return service;
                            });

                            await updateServices(user._id, updatedServices);
                            await fetchServices(user._id);

                            setEditingItem(null);
                            setEditingComponent(null);
                            setNewItemData({
                              title: "",
                              description: "",
                              percentage: 0,
                              startDate: "",
                              endDate: "",
                              day: "",
                              from: "09:00",
                              to: "17:00",
                              isOpen: true,
                              status: "available",
                              image: null,
                              price: "",
                            });
                          }
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
                      : itemToDelete?.component === "offers"
                      ? "offer"
                      : itemToDelete?.component === "availability"
                      ? "availability slot"
                      : "service"}
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
                      {businessName || "Your Business Name"}
                    </h3>

                    <div className="flex justify-between items-start w-full">
                      <p className="text-gray-600 text-xs max-w-xs break-words line-clamp-2">
                        {bio ||
                          "Your business bio will appear here. Add a compelling description to attract customers."}
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
                              Customers will be able to leave reviews here
                            </p>
                          </div>
                        ) : component.items.length > 0 ? (
                          <div className="space-y-3">
                            {component.items
                              .filter(
                                (item, index, self) =>
                                  index ===
                                  self.findIndex((i) => i.id === item.id)
                              )
                              .map((item) => (
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
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <h5 className="font-semibold text-sm text-gray-800">
                                        {item.title ||
                                          item.name ||
                                          item.day ||
                                          item.category ||
                                          item.reviewer ||
                                          item.street ||
                                          ""}
                                      </h5>
                                      {(component.id === "offers" ||
                                        component.id === "designs" ||
                                        component.id === "services") &&
                                        item.price && (
                                          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            LKR {item.price}
                                          </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {item.description ||
                                        (component.id === "availability" &&
                                          `${item.from} - ${item.to}`) ||
                                        item.comment ||
                                        ""}
                                    </p>
                                    {item.rating && (
                                      <div className="flex items-center mt-1">
                                        {Array.from({
                                          length: parseInt(item.rating),
                                        }).map((_, i) => (
                                          <span
                                            key={i}
                                            className="text-yellow-400"
                                          >
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
                Let's make your business profile
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
              Business Profile Setup
            </h1>
            <p className="text-sm text-primary/40 mt-2">
              Customize how customers see your business
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

export default BusinessProfileSetup;
