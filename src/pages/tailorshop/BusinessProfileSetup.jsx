import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "../../components/profile-setup/BasicInfoStep";
import ComponentsSelectionStep from "../../components/profile-setup/ComponentsSelectionStep";
import ContentStep from "../../components/profile-setup/ContentStep";
import PreviewStep from "../../components/profile-setup/PreviewStep";
import ProfileStepper from "../../components/profile-setup/ProfileStepper";
import WelcomeScreen from "../../components/profile-setup/WelcomeScreen";
import { CustomButton } from "../../components/ui/Button";
import { initialProfileComponents } from "../../configs/Profile.configs";
import { useAuthStore } from "../../store/Auth.store";
import { useShopStore } from "../../store/Shop.store";

const BusinessProfileSetup = () => {
  const { tailor, fetchTailorById, updateTailor } = useShopStore();
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // State declarations
  const [showWelcome, setShowWelcome] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [components, setComponents] = useState(initialProfileComponents);
  const [currentStep, setCurrentStep] = useState(0);
  const [newItemData, setNewItemData] = useState({});
  const [editingComponent, setEditingComponent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Steps configuration
  const steps = [
    { id: "basics", title: "Basic Info" },
    { id: "components", title: "Components" },
    { id: "content", title: "Add Content" },
    { id: "preview", title: "Preview" },
  ];

  // Handle welcome message timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Fetch tailor data on component mount
  useEffect(() => {
    if (user && user._id) {
      fetchTailorById(user._id);
    }
  }, [fetchTailorById, user]);

  // Update state with tailor data when it's loaded
  useEffect(() => {
    if (tailor) {
      updateStateFromTailorData(tailor);
    }
  }, [tailor]);

  // Helper function to update the state with tailor data
  const updateStateFromTailorData = (tailorData) => {
    setBusinessName(tailorData.shopName || "");
    setProfileImage(tailorData.logoUrl || null);
    setBio(tailorData.bio || "");

    // Create a copy of the components to update
    const updatedComponents = [...components];

    // Update address component
    updateAddressComponent(updatedComponents, tailorData);

    // Update other components: offers, designs, availability, services, reviews
    updateComponentWithTailorData(
      updatedComponents,
      "offers",
      tailorData.offers
    );
    updateComponentWithTailorData(
      updatedComponents,
      "designs",
      tailorData.designs
    );
    updateComponentWithTailorData(
      updatedComponents,
      "availability",
      tailorData.availability
    );
    updateComponentWithTailorData(
      updatedComponents,
      "services",
      tailorData.services
    );
    updateComponentWithTailorData(
      updatedComponents,
      "reviews",
      tailorData.reviews
    );

    setComponents(updatedComponents);
  };

  // Helper function to update address component
  const updateAddressComponent = (componentsArray, tailorData) => {
    if (tailorData.shopAddress) {
      const addressComp = componentsArray.find((comp) => comp.id === "address");
      if (addressComp) {
        addressComp.enabled = true;
        const addressString = tailorData.shopAddress || "";
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
  };

  // Helper function to update a component with tailor data
  const updateComponentWithTailorData = (
    componentsArray,
    componentId,
    items
  ) => {
    if (items && Array.isArray(items) && items.length > 0) {
      const component = componentsArray.find((comp) => comp.id === componentId);
      if (component) {
        component.enabled = true;

        switch (componentId) {
          case "offers":
          case "designs":
            component.items = items.map((item) => ({
              id: item.id || Date.now(),
              title: item.title || "",
              description: item.description || "",
              image: item.image || null,
            }));
            break;
          case "availability":
            component.items = items.map((item) => ({
              id: item.id || Date.now(),
              day: item.day || "",
              hours: item.hours || "",
            }));
            break;
          case "services":
            component.items = items.map((item) => ({
              id: item.id || Date.now(),
              title: item.title || "",
              description: item.description || "",
              price: item.price || "",
            }));
            break;
          case "reviews":
            component.items = items.map((item) => ({
              id: item.id || Date.now(),
              reviewer: item.reviewer || item.clientName || "",
              comment: item.comment || item.text || "",
              rating: item.rating || "5",
            }));
            break;
        }
      }
    }
  };

  // Toggle component selection
  const toggleComponent = (id) => {
    setComponents(
      components.map((comp) =>
        comp.id === id ? { ...comp, enabled: !comp.enabled } : comp
      )
    );
  };

  // Navigation functions
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

  // Component editing functions
  const startEditing = (componentId) => {
    setEditingComponent(componentId);
    setNewItemData({});
  };

  const handleNewItemChange = (fieldName, value) => {
    setNewItemData({
      ...newItemData,
      [fieldName]: value,
    });
  };

  const addNewItem = () => {
    if (editingComponent) {
      setComponents(
        components.map((comp) =>
          comp.id === editingComponent
            ? {
                ...comp,
                items: [...comp.items, { id: Date.now(), ...newItemData }],
              }
            : comp
        )
      );
      setNewItemData({});
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle component image upload
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

  // Save profile data
  const handleSaveProfile = async () => {
    if (!user || !user._id) {
      setSaveError("User information not available");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updateData = prepareUpdateData();
      const result = await updateTailor(user._id, updateData);
      console.log("Update result:", result);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveError(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to prepare data for API update
  const prepareUpdateData = () => {
    const updateData = {
      shopName: businessName,
      logoUrl: profileImage,
      bio: bio,
    };

    const enabledComponents = components.filter((comp) => comp.enabled);

    enabledComponents.forEach((component) => {
      switch (component.id) {
        case "offers":
          updateData.offers = component.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
          }));
          break;
        case "designs":
          updateData.designs = component.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
          }));
          break;
        case "availability":
          updateData.availability = component.items.map((item) => ({
            id: item.id,
            day: item.day,
            hours: item.hours,
          }));
          break;
        case "services":
          updateData.services = component.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
          }));
          break;
        case "address":
          if (component.items.length > 0) {
            updateData.shopAddress = component.items[0].street;
          }
          break;
      }
    });

    return updateData;
  };

  // Render the current step
  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "basics":
        return (
          <BasicInfoStep
            profileImage={profileImage}
            businessName={businessName}
            bio={bio}
            isLoading={isLoading}
            handleImageUpload={handleImageUpload}
            setBusinessName={setBusinessName}
            setBio={setBio}
          />
        );
      case "components":
        return (
          <ComponentsSelectionStep
            components={components}
            toggleComponent={toggleComponent}
          />
        );
      case "content":
        return (
          <ContentStep
            components={components}
            editingComponent={editingComponent}
            newItemData={newItemData}
            startEditing={startEditing}
            handleNewItemChange={handleNewItemChange}
            handleComponentImageUpload={handleComponentImageUpload}
            addNewItem={addNewItem}
            setEditingComponent={setEditingComponent}
            setCurrentStep={setCurrentStep}
          />
        );
      case "preview":
        return (
          <PreviewStep
            profileImage={profileImage}
            businessName={businessName}
            bio={bio}
            components={components}
            saveSuccess={saveSuccess}
            saveError={saveError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-auto w-full bg-gradient-to-br from-blue-50 via-secondary/20 to-blue-100">
      {showWelcome && <WelcomeScreen />}

      {!showWelcome && (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="space-y-8">
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
            <ProfileStepper steps={steps} currentStep={currentStep} />

            {/* Step content */}
            {renderStepContent()}

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
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileSetup;
