import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { provinceCityMapping } from "../configs/Form.configs";
import { useAuthStore } from "../store/Auth.store";
import { CustomButton } from "./ui/Button";

// Input field component
const InputField = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  error,
  roleType,
}) => (
  <div className="w-full">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 pl-4 pr-4 border rounded-full text-xs 
                ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                ${error ? "border-red-500" : "border-gray-300"}
                border-gray-300 focus:!ring-primary
                focus:!border-secondary focus:!ring-1 outline-none
              `}
      required={required}
      disabled={disabled}
      data-role-type={roleType}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Select field component
const SelectField = ({
  name,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
  roleType,
  placeholder,
}) => (
  <div className="relative w-full">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 pl-4 pr-10 border rounded-full text-xs appearance-none text-gray-400
                ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                ${error ? "border-red-500" : "border-gray-300"}
                border-gray-300 focus:!ring-primary
                focus:!border-secondary focus:!ring-1 outline-none
              `}
      required={required}
      disabled={disabled}
      data-role-type={roleType}
    >
      <option value="">{placeholder || `Select ${name}`}</option>
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
    <span className="absolute right-0 pr-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg
        className={"text-gray-400"}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </span>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Logo upload component for TailorShop
const LogoUpload = ({ onChange, error, value }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Initialize preview URL if value exists
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileUrl = reader.result;
        setPreviewUrl(fileUrl);
        onChange({ target: { name: "logoUrl", value: fileUrl } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <div
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => document.getElementById("logo-upload").click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Shop logo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-xs mt-2">Upload Shop Logo</p>
            </div>
          )}
        </div>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-xs mt-2">Click to upload logo</p>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

// Form stepper component for multi-step forms
const FormStepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => (
          <React.Fragment key={i}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < currentStep
                  ? "bg-primary text-white text-sm"
                  : i === currentStep
                  ? "bg-primary text-white text-sm"
                  : "bg-gray-200 text-gray-600 text-xs"
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`h-[2px] flex-1 mx-2 ${
                  i < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Main form component
const Form = ({
  customFields,
  formType,
  values = {},
  onChange,
  onSubmit,
  errors = {},
  setErrors = () => {},
  disabled = {},
  button = "Submit",
  className = "",
  heading1,
  heading2,
  footerConfig,
  onRoleTypeChange,
  showDivider = true,
  showTerms = true,
  showAlternateSignup = true,
  multiStep = false,
}) => {
  const [roleType, setRoleType] = useState(1); // 1 for user, 4 for tailor shop
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({ ...values });
  const [formErrors, setFormErrors] = useState({ ...errors });
  const [availableCities, setAvailableCities] = useState([]);
  const totalSteps = 2; // Reduced to 2 steps since bank details are removed
  const navigate = useNavigate();
  const { isLoading } = useAuthStore();

  // Update internal form values when external values change
  useEffect(() => {
    setFormValues({ ...values });
  }, [values]);

  // Update internal errors when external errors change
  useEffect(() => {
    setFormErrors({ ...errors });
  }, [errors]);

  // Update available cities when province changes
  useEffect(() => {
    if (formValues.province) {
      const citiesForProvince = provinceCityMapping[formValues.province] || [];
      setAvailableCities(citiesForProvince);

      // Reset city value if current selected city is not in the new province
      if (formValues.city && !citiesForProvince.includes(formValues.city)) {
        const updatedValues = { ...formValues, city: "" };
        setFormValues(updatedValues);
        if (onChange) {
          onChange({ target: { name: "city", value: "" } });
        }
      }
    } else {
      setAvailableCities([]);
    }
  }, [formValues.province]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);

    // Clear error for this field when user changes it
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
      setErrors(newErrors);
    }

    if (onChange) {
      onChange({ target: { name, value } });
    }
  };

  // Toggle role type between 1 and 4
  const toggleRoleType = () => {
    const newRoleType = roleType === 1 ? 4 : 1;
    setRoleType(newRoleType);
    if (onRoleTypeChange) {
      onRoleTypeChange(newRoleType);
    }
  };

  // Validate individual steps
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Validate account details
      if (!formValues.name) newErrors.name = "Name is required";

      if (!formValues.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formValues.email))
        newErrors.email = "Please enter a valid email";

      if (!formValues.password) newErrors.password = "Password is required";
      else if (formValues.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";

      if (!formValues.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formValues.password !== formValues.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    } else if (step === 1) {
      // Validate business/contact details
      if (roleType === 4) {
        if (!formValues.shopName)
          newErrors.shopName = "Business name is required";
        if (!formValues.logoUrl) newErrors.logoUrl = "Shop logo is required";
      } else {
        if (!formValues.name) newErrors.name = "Name is required";
      }

      if (!formValues.contactNumber)
        newErrors.contactNumber = "Contact number is required";
      if (!formValues.address) newErrors.address = "Street address is required";
      if (!formValues.city) newErrors.city = "City is required";
      if (!formValues.province) newErrors.province = "Province is required";
      if (!formValues.postalCode)
        newErrors.postalCode = "Postal code is required";
    }

    setFormErrors(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Default fields configuration
  const defaultFields = {
    forgotPassword: [
      {
        name: "email",
        type: "email",
        placeholder: "Enter your email address",
        required: true,
      },
    ],
    login: [
      {
        name: "email",
        type: "email",
        placeholder: "Enter your email address",
        required: true,
      },
      {
        name: "password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
      },
    ],
    resetPassword: [
      {
        name: "password",
        type: "password",
        placeholder: "Enter your new password",
        required: true,
      },
      {
        name: "confirmPassword",
        type: "password",
        placeholder: "Confirm your new password",
        required: true,
      },
    ],
    signup: [
      {
        name: "name",
        type: "text",
        placeholder: "Enter your name",
        required: true,
      },
      {
        name: "email",
        type: "email",
        placeholder: "Enter your email address",
        required: true,
      },
      {
        name: "password-group",
        gridCols: 2,
        fields: [
          {
            name: "password",
            type: "password",
            placeholder: "Set a password",
            required: true,
          },
          {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm the password",
            required: true,
          },
        ],
      },
      {
        name: "contactNumber",
        type: "tel",
        placeholder: "Enter your contact number",
        required: true,
      },
      {
        name: "location-group",
        gridCols: 2,
        fields: [
          {
            name: "country",
            type: "select",
            options: ["Sri Lanka"],
            required: true,
          },
          {
            name: "province",
            type: "select",
            options: [
              "Central Province",
              "Eastern Province",
              "Northern Province",
              "Southern Province",
              "Western Province",
              "North Western Province",
              "North Central Province",
              "Uva Province",
              "Sabaragamuwa Province",
            ],
            required: true,
          },
        ],
      },
      {
        name: "address-group",
        gridCols: 2,
        fields: [
          {
            name: "city",
            type: "select",
            options: [], // This will be dynamically populated based on selected province
            required: true,
            placeholder: "Select city",
          },
          {
            name: "postalCode",
            type: "text",
            placeholder: "Enter your postal code",
            required: true,
          },
        ],
      },
      {
        name: "address",
        type: "text",
        placeholder: "Enter your street address",
        required: true,
      },
    ],
    // Multi-step form fields for tailor shop signup
    tailorSignup: [
      // Step 1: Account Information
      {
        step: 0,
        fields: [
          {
            name: "name",
            type: "text",
            placeholder: "Enter your name",
            required: true,
          },
          {
            name: "email",
            type: "email",
            placeholder: "Enter your email address",
            required: true,
          },
          {
            name: "password",
            type: "password",
            placeholder: "Set a password",
            required: true,
          },
          {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm your password",
            required: true,
          },
        ],
      },
      // Step 2: Business Details
      {
        step: 1,
        fields: [
          {
            name: "shopName",
            type: "text",
            placeholder: "Enter your business name",
            required: true,
          },
          {
            name: "logoUrl",
            type: "logo",
            placeholder: "Upload Shop Logo",
            required: true,
          },
          {
            name: "contactNumber",
            type: "tel",
            placeholder: "Enter contact number",
            required: true,
          },
          {
            name: "location-group",
            gridCols: 2,
            fields: [
              {
                name: "country",
                type: "select",
                options: ["Sri Lanka"],
                required: true,
              },
              {
                name: "province",
                type: "select",
                options: [
                  "Central Province",
                  "Eastern Province",
                  "Northern Province",
                  "Southern Province",
                  "Western Province",
                  "North Western Province",
                  "North Central Province",
                  "Uva Province",
                  "Sabaragamuwa Province",
                ],
                required: true,
              },
            ],
          },
          {
            name: "address-group",
            gridCols: 2,
            fields: [
              {
                name: "city",
                type: "select",
                options: [], // This will be dynamically populated based on selected province
                required: true,
                placeholder: "Select city",
              },
              {
                name: "postalCode",
                type: "text",
                placeholder: "Enter postal code",
                required: true,
              },
            ],
          },
          {
            name: "address",
            type: "text",
            placeholder: "Enter street address",
            required: true,
          },
        ],
      },
    ],
  };

  // Override the city options with available cities based on selected province
  const getUpdatedFields = (originalFields) => {
    return originalFields.map((field) => {
      if (field.name === "address-group") {
        return {
          ...field,
          fields: field.fields.map((subField) => {
            if (subField.name === "city") {
              return {
                ...subField,
                options: availableCities,
              };
            }
            return subField;
          }),
        };
      } else if (field.fields) {
        return {
          ...field,
          fields: field.fields.map((subField) => {
            if (subField.name === "city") {
              return {
                ...subField,
                options: availableCities,
              };
            }
            return subField;
          }),
        };
      }
      return field;
    });
  };

  // Get fields for current form type and update dynamic fields
  const fields =
    customFields ||
    (defaultFields[formType] ? getUpdatedFields(defaultFields[formType]) : []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (multiStep) {
      if (currentStep < totalSteps - 1) {
        handleNext();
        return;
      }

      if (!validateStep(currentStep)) {
        return;
      }
    } else {
      let hasErrors = false;
      const newErrors = {};

      fields.forEach((field) => {
        if (field.fields) {
          field.fields.forEach((subField) => {
            if (subField.required && !formValues[subField.name]) {
              newErrors[subField.name] = `${subField.name} is required`;
              hasErrors = true;
            }
          });
        } else if (field.required && !formValues[field.name]) {
          newErrors[field.name] = `${field.name} is required`;
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setFormErrors(newErrors);
        setErrors(newErrors);
        return;
      }
    }

    onSubmit({ ...formValues, roleType });
  };

  // Render individual field
  const renderField = (field) => {
    if (disabled[field.name] === true) {
      return null;
    }

    const commonProps = {
      name: field.name,
      value: formValues[field.name] || "",
      onChange: handleChange,
      required: field.required,
      disabled: disabled[field.name] || false,
      error: formErrors[field.name],
      roleType,
      placeholder: field.placeholder,
    };

    if (field.type === "select") {
      return <SelectField {...commonProps} options={field.options} />;
    } else if (field.type === "logo") {
      return <LogoUpload {...commonProps} />;
    }

    return (
      <InputField
        {...commonProps}
        type={field.type}
        placeholder={field.placeholder}
      />
    );
  };

  // Render field group
  const renderFieldGroup = (fieldGroup) => {
    if (!fieldGroup.fields) {
      return <div key={fieldGroup.name}>{renderField(fieldGroup)}</div>;
    }

    const visibleFields = fieldGroup.fields.filter(
      (subField) => !disabled[subField.name]
    );

    if (visibleFields.length === 0) return null;

    const isPasswordGroup = fieldGroup.name === "password-group";
    const isLocationGroup = fieldGroup.name === "location-group";
    const isAddressGroup = fieldGroup.name === "address-group";

    if (
      (isPasswordGroup || isLocationGroup || isAddressGroup) &&
      visibleFields.length === fieldGroup.gridCols
    ) {
      return (
        <div
          key={fieldGroup.name}
          className={`grid grid-cols-${fieldGroup.gridCols} gap-2`}
        >
          {visibleFields.map((subField) => (
            <div key={subField.name}>{renderField(subField)}</div>
          ))}
        </div>
      );
    }

    return (
      <div key={fieldGroup.name} className="space-y-3">
        {visibleFields.map((subField) => (
          <div key={subField.name}>{renderField(subField)}</div>
        ))}
      </div>
    );
  };

  // Find the correct fields to display for the current step in a multi-step form
  const getStepFields = (step) => {
    const currentStepData = fields.find(
      (stepFields) => stepFields.step === step
    );

    if (!currentStepData) return [];

    return getUpdatedFields(currentStepData.fields);
  };

  // Render the fields for the current step if this is a multi-step form
  const renderStepContent = () => {
    if (!multiStep) {
      return fields.map((fieldGroup, index) => (
        <React.Fragment key={index}>
          {renderFieldGroup(fieldGroup)}
        </React.Fragment>
      ));
    }

    const currentStepFields = getStepFields(currentStep);

    return (
      <div className="space-y-4">
        {currentStepFields.map((field, index) => (
          <React.Fragment key={index}>{renderFieldGroup(field)}</React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      {heading1 && (
        <h2 className={"text-sm font-bold text-left text-primary"}>
          {heading1}
        </h2>
      )}
      {heading2 && (
        <h2 className="text-xs font-light text-left mb-2">{heading2}</h2>
      )}

      {multiStep && (
        <FormStepper currentStep={currentStep} totalSteps={totalSteps} />
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="p-2" />

        {renderStepContent()}

        <div className="p-2" />

        {multiStep ? (
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <CustomButton
                text="Previous"
                color="primary"
                hover_color="gray-300"
                variant="outlined"
                width="w-1/3"
                height="h-9"
                type="button"
                onClick={handlePrevious}
              />
            )}

            {currentStep < totalSteps - 1 ? (
              <CustomButton
                text="Next"
                color="primary"
                hover_color="hoverAccent"
                variant="filled"
                width={currentStep === 0 ? "w-full" : "w-1/3"}
                height="h-9"
                type="button"
                onClick={handleNext}
                className={currentStep === 0 ? "" : "ml-auto"}
              />
            ) : (
              <CustomButton
                text={isLoading ? "Registering..." : "Complete Registration"}
                color="primary"
                hover_color="hoverAccent"
                variant="filled"
                width="w-1/3"
                height="h-9"
                type="submit"
                disabled={isLoading}
                className="ml-auto"
              />
            )}
          </div>
        ) : (
          <CustomButton
            text={button}
            color="primary"
            hover_color="hoverAccent"
            variant="filled"
            width="w-full"
            height="h-9"
            type="submit"
            disabled={isLoading}
          />
        )}
      </form>

      {!multiStep &&
        footerConfig?.loginSignupRedirect &&
        !disabled.loginSignupRedirect && (
          <>
            <div className="mt-2 flex items-right justify-end">
              {formType === "login" && !disabled.forgotPassword && (
                <a
                  href={footerConfig.forgotPasswordLink}
                  className={
                    "text-primary hover:underline text-xs cursor-pointer"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="mt-2 flex justify-center items-center">
              <p className="text-xs">
                {footerConfig.loginSignupRedirect.text}{" "}
                <a
                  href={footerConfig.loginSignupRedirect.link}
                  className={"text-primary hover:underline cursor-pointer"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(footerConfig.loginSignupRedirect.link);
                  }}
                >
                  {footerConfig.loginSignupRedirect.linkText}
                </a>
              </p>
            </div>
          </>
        )}

      {showDivider && <div className="m-5 border-b border-gray-200" />}

      {showTerms && footerConfig?.terms && !disabled.terms && (
        <div className="text-center mt-2">
          <p className="text-xs">
            {footerConfig.terms.text}{" "}
            <a
              href={footerConfig.terms.link}
              className={"text-primary hover:underline cursor-pointer"}
            >
              {footerConfig.terms.linkText}
            </a>{" "}
            and{" "}
            <a
              href={footerConfig.privacy.link}
              className={"text-primary hover:underline cursor-pointer"}
            >
              {footerConfig.privacy.linkText}
            </a>
            .
          </p>
        </div>
      )}

      {showAlternateSignup &&
        footerConfig?.alternateSignup &&
        !disabled.alternateSignup && (
          <div className="text-center mt-2">
            <p className="text-xs">
              {footerConfig.alternateSignup.text}{" "}
              <a
                href={footerConfig.alternateSignup.link}
                className={"text-primary hover:underline cursor-pointer"}
                onClick={(e) => {
                  e.preventDefault();
                  toggleRoleType();
                }}
              >
                {footerConfig.alternateSignup.linkText}
              </a>
            </p>
          </div>
        )}
    </div>
  );
};

export default Form;
