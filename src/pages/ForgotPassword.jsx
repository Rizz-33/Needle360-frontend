import { useState } from "react";
import Form from "../components/Form";
import { footerConfigs, headingConfigs } from "../configs/Form.configs";

export default function ForgotPassword() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [values, setValues] = useState({}); // Define values state
  const [errors, setErrors] = useState({}); // Define errors state
  const [disabled, setDisabled] = useState(false); // Define disabled state

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-tr from-white via-blue-50 to-blue-100">
      <div className="p-6 rounded-2xl shadow-lg w-96 text-center bg-white">
        <Form
          formType={"forgotPassword"}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          disabled={disabled}
          button="Get Started"
          heading1={headingConfigs.forgotPassword.heading1}
          heading2={headingConfigs.forgotPassword.heading2}
          footerConfig={footerConfigs.forgotPassword}
        />
      </div>
    </div>
  );
}
