import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/Auth.store";
import { CustomButton } from "./Button";

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

const SelectField = ({
  name,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
  roleType,
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
      <option value="">{`Select ${name}`}</option>
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
  </div>
);

const Form = ({
  customFields,
  formType,
  values,
  onChange,
  onSubmit,
  errors = {},
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
}) => {
  const [roleType, setRoleType] = useState(1);
  const navigate = useNavigate();
  const { isLoading } = useAuthStore();

  const toggleRoleType = () => {
    const newRoleType = roleType === 1 ? 4 : 1;
    setRoleType(newRoleType);
    // Notify parent component of roleType change
    if (onRoleTypeChange) {
      onRoleTypeChange(newRoleType);
    }
  };

  // Default fields configuration
  const defaultFields = {
    signup: [
      {
        name: roleType === 1 ? "name" : "businessName",
        type: "text",
        placeholder:
          roleType === 1 ? "Enter your name" : "Enter your business name",
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
            options: ["Country1", "Country2"],
            required: true,
          },
          {
            name: "province",
            type: "select",
            options: ["Province1", "Province2"],
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
            options: ["City1", "City2"],
            required: true,
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
        name: "streetAddress",
        type: "text",
        placeholder: "Enter your street address",
        required: true,
      },
      {
        name: "bankDetails-group",
        gridCols: 3,
        fields: [
          {
            name: "accountNumber",
            type: "text",
            placeholder: "Enter your account number",
            required: true,
          },
          {
            name: "accountName",
            type: "text",
            placeholder: "Enter account name",
            required: true,
          },
          {
            name: "bankName",
            type: "text",
            placeholder: "Enter bank name",
            required: true,
          },
        ],
      },
    ].concat(
      roleType === 4
        ? [
            {
              name: "businessDetails-group",
              gridCols: 2,
              fields: [
                {
                  name: "registrationNumber",
                  type: "text",
                  placeholder: "Enter your registration number",
                  required: true,
                },
                {
                  name: "taxId",
                  type: "text",
                  placeholder: "Enter your tax ID",
                  required: true,
                },
              ],
            },
          ]
        : []
    ),
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
    forgotPassword: [
      {
        name: "email",
        type: "email",
        placeholder: "Enter your email address",
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
  };

  const fields = customFields || defaultFields[formType] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...values, roleType });
  };

  const renderField = (field) => {
    if (disabled[field.name] === true) {
      return null;
    }

    const commonProps = {
      name: field.name,
      value: values[field.name] || "",
      onChange,
      required: field.required,
      disabled: disabled[field.name] || false,
      error: errors[field.name],
      roleType,
    };

    if (field.type === "select") {
      return <SelectField {...commonProps} options={field.options} />;
    }

    return (
      <InputField
        {...commonProps}
        type={field.type}
        placeholder={field.placeholder}
      />
    );
  };

  const renderFieldGroup = (fieldGroup) => {
    // Skip rendering if it's businessDetails-group and roleType is 1
    if (roleType === 1 && fieldGroup.name === "businessDetails-group") {
      return null;
    }

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
    const isBankDetailsGroup = fieldGroup.name === "bankDetails-group";
    const isBusinessDetailsGroup = fieldGroup.name === "businessDetails-group";

    if (
      (isPasswordGroup ||
        isLocationGroup ||
        isBankDetailsGroup ||
        isBusinessDetailsGroup ||
        isAddressGroup) &&
      visibleFields.length === fieldGroup.gridCols
    ) {
      return (
        <div
          key={fieldGroup.name}
          className={`grid ${
            isBankDetailsGroup ? "grid-cols-3" : "grid-cols-2"
          } gap-2`}
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
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="p-2" />

        {fields.map((fieldGroup, index) => (
          <React.Fragment key={index}>
            {renderFieldGroup({ ...fieldGroup, roleType })}
          </React.Fragment>
        ))}

        <div className="p-2" />

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
      </form>

      {footerConfig?.loginSignupRedirect && !disabled.loginSignupRedirect && (
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
