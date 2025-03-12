import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { footerConfigs, headingConfigs } from "../../configs/Form.configs";
import { useAuthStore } from "../../store/Auth.store";

const AdminLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [disabled] = useState({});
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  // The admin role type is fixed at 9
  const roleType = 9;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (formValues) => {
    console.log("Admin login form submitted with values:", formValues);
    try {
      // Pass roleType 9 for admin login
      const result = await login(
        formValues.email,
        formValues.password,
        roleType
      );

      // Check if the logged-in user's role is admin (9)
      if (result.user.role !== roleType) {
        setErrors({
          auth: "Invalid admin credentials. Please try again.",
        });
        return;
      }

      // Redirect to admin dashboard instead of homepage
      navigate("/dashboard");
    } catch (error) {
      console.error("Admin login failed:", error);
      setErrors({
        auth:
          error.message || "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <div className="flex w-full h-screen overflow-auto bg-gradient-to-tr from-white to-blue-50 justify-center items-center">
      <div className="w-1/2 hidden md:block">
        <img
          src="/api/placeholder/800/600"
          alt="Admin Login"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 mt-9 pr-24">
        <Form
          formType={"login"}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={{ ...errors, ...(error ? { auth: error } : {}) }}
          disabled={disabled}
          button="Admin Login"
          heading1={headingConfigs.adminLogin.heading1}
          heading2={headingConfigs.adminLogin.heading2}
          footerConfig={footerConfigs.adminLogin}
          showTerms={false}
          showAlternateSignup={false}
        />
        {errors.auth && (
          <p className="text-red-500 text-sm mt-2 text-center">{errors.auth}</p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
