import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { footerConfigs, headingConfigs } from "../../configs/Form.configs";
import { useAuthStore } from "../../store/Auth.store";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [disabled] = useState({});
  const [roleType, setRoleType] = useState(1);
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle role type change
  const handleRoleTypeChange = (newRoleType) => {
    setRoleType(newRoleType);
  };

  // Handle form submission
  const handleSubmit = async (formValues) => {
    try {
      const result = await login(formValues.email, formValues.password);

      // Check if the logged-in user's role matches the selected roleType
      if (result.user.role !== roleType) {
        setErrors({
          auth: `Invalid credentials for ${
            roleType === 1 ? "Customer" : "Tailor"
          } account.`,
        });
        return;
      }

      navigate("/");
    } catch (error) {
      // Avoid logging sensitive data
      setErrors({ auth: error.message || "Login failed." });
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden bg-gradient-to-tr from-white to-blue-50">
      <div className="w-full md:w-1/2 hidden md:block">
        <img
          src="/doodle-1.png"
          alt="Login"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <Form
            formType={"login"}
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={{ ...errors, ...(error ? { auth: error } : {}) }}
            disabled={disabled}
            button="Get Started"
            heading1={
              roleType === 1
                ? headingConfigs.customerLogin.heading1
                : headingConfigs.tailorLogin.heading1
            }
            heading2={
              roleType === 1
                ? headingConfigs.customerLogin.heading2
                : headingConfigs.tailorLogin.heading2
            }
            footerConfig={
              roleType === 1
                ? footerConfigs.customerLogin
                : footerConfigs.tailorLogin
            }
            onRoleTypeChange={handleRoleTypeChange}
          />
          {errors.auth && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.auth}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
