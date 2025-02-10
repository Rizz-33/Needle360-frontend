import React, { useState } from "react";
import Form from "../components/Form";
import { footerConfigs, headingConfigs } from "../configs/Form.configs";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState({});
  const [roleType, setRoleType] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleRoleTypeChange = (newRoleType) => {
    setRoleType(newRoleType);
    // You can perform additional actions based on roleType change here
  };

  const handleSubmit = (formValues) => {
    console.log("Form submitted with values:", formValues);
  };

  return (
    <div className="flex w-full h-screen overflow-auto bg-gradient-to-tr from-white to-blue-50 justify-center items-center">
      <div className="w-1/2 hidden md:block">
        <img
          src="/api/placeholder/800/600"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 mt-9 pr-24">
        <Form
          formType={"login"}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
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
      </div>
    </div>
  );
};

export default Login;
