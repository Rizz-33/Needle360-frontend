import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { footerConfigs, headingConfigs } from "../../configs/Form.configs";
import { useAuthStore } from "../../store/Auth.store";

// AdminLogin.jsx
const AdminLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [disabled] = useState({});
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  const roleType = 9;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (formValues) => {
    try {
      const result = await login(
        formValues.email,
        formValues.password,
        roleType
      );

      if (result.user.role !== roleType) {
        setErrors({
          auth: "Invalid admin credentials. Please try again.",
        });
        return;
      }

      localStorage.setItem("token", result.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Admin login failed:", error);
      setErrors({
        auth:
          error.message || "An error occurred during login. Please try again.",
      });
    }
  };

  useEffect(() => {
    return () => {
      setErrors({});
    };
  }, []);

  return (
    <div className="flex w-full h-screen overflow-auto bg-gradient-to-tr from-white to-blue-50 justify-center items-center">
      <div className="w-1/2 hidden md:block">
        <img
          src="/computer-user.png"
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
