import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { footerConfigs, headingConfigs } from "../../configs/Form.configs";
import { useAuthStore } from "../../store/Auth.store";

const Signup = () => {
  const [roleType, setRoleType] = useState(1); // 1 for user, 4 for tailor shop
  const [values, setValues] = useState({
    name: "",
    shopName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    country: "Sri Lanka",
    province: "",
    city: "",
    postalCode: "",
    address: "",
    logoUrl: "",
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleTypeChange = (newRoleType) => {
    setRoleType(newRoleType);
    setValues((prev) => ({
      ...prev,
      name: "",
      shopName: "",
      logoUrl: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (roleType === 1) {
      if (!values.name) newErrors.name = "Name is required";
    } else {
      if (!values.shopName) newErrors.shopName = "Business name is required";
      if (!values.logoUrl) newErrors.logoUrl = "Shop logo is required";
    }

    if (!values.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!values.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      newErrors.email = "Please enter a valid email";
    if (!values.password) newErrors.password = "Password is required";
    else if (values.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!values.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (values.password !== values.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!values.province) newErrors.province = "Province is required";
    if (!values.city) newErrors.city = "City is required";
    if (!values.postalCode) newErrors.postalCode = "Postal code is required";
    if (!values.address) newErrors.address = "Street address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await signup(values, roleType);
      navigate("/verify-email");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "An error occurred during signup",
      }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden bg-gradient-to-tr from-white to-blue-50">
      <div className="w-full md:w-1/2 hidden md:block">
        <img
          src="/doodle-2.png"
          alt="Signup"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {roleType === 4 ? (
            <Form
              formType="tailorSignup"
              values={values}
              onChange={handleChange}
              onSubmit={handleSubmit}
              errors={errors}
              disabled={disabled}
              button={isLoading ? "Loading..." : "Complete Registration"}
              heading1={headingConfigs.tailorSignup.heading1}
              heading2={headingConfigs.tailorSignup.heading2}
              footerConfig={footerConfigs.tailorSignup}
              onRoleTypeChange={handleRoleTypeChange}
              multiStep={true}
            />
          ) : (
            <Form
              formType="signup"
              values={values}
              onChange={handleChange}
              onSubmit={handleSubmit}
              errors={errors}
              disabled={disabled}
              button={isLoading ? "Loading..." : "Sign Up"}
              heading1={headingConfigs.customerSignup.heading1}
              heading2={headingConfigs.customerSignup.heading2}
              footerConfig={footerConfigs.customerSignup}
              onRoleTypeChange={handleRoleTypeChange}
            />
          )}

          {(errors.submit || error) && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.submit || error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
