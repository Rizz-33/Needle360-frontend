import React from "react";

const InputField = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  error,
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
            `}
      required={required}
      disabled={disabled}
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
}) => (
  <div className="w-full">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 pl-4 pr-4 border rounded-full text-xs
                ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                ${error ? "border-red-500" : "border-gray-300"}
            `}
      required={required}
      disabled={disabled}
    >
      <option value="">{`Select ${name}`}</option>
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Form = ({
  customFields,
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
}) => {
  // Default fields configuration
  const defaultFields = [
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
      gridCols: 2,
      fields: [
        {
          name: "city",
          type: "text",
          placeholder: "Enter your city",
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
      name: "bankDetails",
      type: "text",
      placeholder: "Enter your bank details",
      required: true,
    },
  ];

  // Use custom fields if provided, otherwise use default fields
  const fields = customFields || defaultFields;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const renderField = (field) => {
    // Skip rendering if field is disabled and in the disabled object
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

  const renderFieldGroup = (field) => {
    // For grouped fields, check if all fields in the group are disabled
    if (field.fields) {
      const visibleFields = field.fields.filter(
        (subField) => !disabled[subField.name]
      );
      if (visibleFields.length === 0) return null;

      return (
        <div
          key={field.fields.map((f) => f.name).join("-")}
          className={
            field.gridCols ? `grid grid-cols-${field.gridCols} gap-2` : ""
          }
        >
          {visibleFields.map((subField) => (
            <div key={subField.name}>{renderField(subField)}</div>
          ))}
        </div>
      );
    }

    return <div key={field.name}>{renderField(field)}</div>;
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {heading1 && (
          <h2 className="text-sm font-bold text-left text-primary">
            {heading1}
          </h2>
        )}
        {heading2 && (
          <h2 className="text-xs font-extralight text-left mb-9">{heading2}</h2>
        )}
        {fields.map(renderFieldGroup)}

        <div className="p-2" />

        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded-full hover:bg-secondary transition duration-300 text-xs"
        >
          {button}
        </button>
      </form>

      {footerConfig?.loginSignupRedirect && !disabled.loginSignupRedirect && (
        <div className="text-center mt-2">
          <p className="text-xs">
            {footerConfig.loginSignupRedirect.text}{" "}
            <a
              href={footerConfig.loginSignupRedirect.link}
              className="text-primary hover:underline"
            >
              {footerConfig.loginSignupRedirect.linkText}
            </a>
          </p>
        </div>
      )}

      <div className="m-5 border-b border-gray-200" />

      {footerConfig?.terms && !disabled.terms && (
        <div className="text-center mt-2">
          <p className="text-xs">
            {footerConfig.terms.text}{" "}
            <a
              href={footerConfig.terms.link}
              className="text-primary hover:underline"
            >
              {footerConfig.terms.linkText}
            </a>{" "}
            and{" "}
            <a
              href={footerConfig.privacy.link}
              className="text-primary hover:underline"
            >
              {footerConfig.privacy.linkText}
            </a>
            .
          </p>
        </div>
      )}

      {footerConfig?.alternateSignup && !disabled.alternateSignup && (
        <div className="text-center mt-2">
          <p className="text-xs">
            {footerConfig.alternateSignup.text}{" "}
            <a
              href={footerConfig.alternateSignup.link}
              className="text-primary hover:underline"
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
