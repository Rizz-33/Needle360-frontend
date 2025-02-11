import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { footerConfigs, headingConfigs } from "../configs/Form.configs";
import { useAuthStore } from "../store/Auth.store";

const Signup = () => {
  const [roleType, setRoleType] = useState(1); // 1 for user, 4 for tailor shop

  // In Signup.jsx
  const [values, setValues] = useState({
    name: "",
    businessName: "", // for tailor shop owner
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    country: "",
    province: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    accountNumber: "",
    accountName: "",
    bankName: "",
    registrationNumber: "", // for tailor shop owner
  });

  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [disabled] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleTypeChange = (newRoleType) => {
    setRoleType(newRoleType);
    // Reset form values when switching roles
    setValues((prev) => ({
      ...prev,
      name: "",
      businessName: "",
      // Reset other fields as needed
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!values.email) newErrors.email = "Email is required";
    if (!values.password) newErrors.password = "Password is required";
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!values.name && roleType === 1) newErrors.name = "Name is required";
    if (!values.businessName && roleType === 4)
      newErrors.businessName = "Business name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Signup.jsx
  const handleSubmit = async (formValues) => {
    if (!validateForm()) return;

    // Map roleType to the correct role string
    const role = roleType === 1 ? "user" : "tailor-shop-owner";

    // Create the final payload
    const payload = {
      ...formValues,
      role: role, // Send the string role instead of the number
      ...(roleType === 1
        ? {
            name: values.name,
            address: values.streetAddress,
            bankAccountNumber: values.accountNumber,
            bankName: values.bankName,
          }
        : {
            name: values.businessName, // Use businessName for tailor shop
            shopName: values.businessName,
            shopAddress: values.streetAddress,
            shopRegistrationNumber: values.registrationNumber,
          }),
    };

    try {
      await signup(payload, roleType);
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup error details:", error);
      // Error handling remains the same
      if (error.code === "ERR_CONNECTION_REFUSED") {
        setErrors((prev) => ({
          ...prev,
          submit: "Unable to connect to server. Please try again later.",
        }));
      } else if (error.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "An error occurred during signup",
        }));
      }
    }
  };

  return (
    <div className="flex w-full h-screen overflow-auto bg-gradient-to-tr from-white to-blue-50 justify-center items-center">
      <div className="w-1/2 hidden md:block">
        <img
          src="/api/placeholder/800/600"
          alt="Signup"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 pr-24">
        <Form
          formType="signup"
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          disabled={disabled}
          button={isLoading ? "Loading..." : "Sign Up"}
          heading1={
            roleType === 1
              ? headingConfigs.customerSignup.heading1
              : headingConfigs.tailorSignup.heading1
          }
          heading2={
            roleType === 1
              ? headingConfigs.customerSignup.heading2
              : headingConfigs.tailorSignup.heading2
          }
          footerConfig={
            roleType === 1
              ? footerConfigs.customerSignup
              : footerConfigs.tailorSignup
          }
          onRoleTypeChange={handleRoleTypeChange}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
