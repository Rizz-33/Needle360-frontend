import { useState } from "react";
import Form from "../components/Form";
import { footerConfigs, headingConfigs } from "../configs/Form.configs";
import { useAuthStore } from "../store/Auth.store";

export default function ForgotPassword() {
  const [values, setValues] = useState({}); // Define values state
  const [errors, setErrors] = useState({}); // Define errors state
  const [disabled] = useState(false); // Define disabled state
  const [isSubmitted, setIsSubmitted] = useState(false); // Define isSubmitted state

  const { forgotPassword } = useAuthStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  console.log("Footer Config:", footerConfigs.forgotPassword.loginRedirect);

  const handleSubmit = async () => {
    try {
      await forgotPassword(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error during forgot password request:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to submit. Please try again.",
      });
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-tr from-white via-blue-50 to-blue-100">
      <div className="p-6 rounded-2xl shadow-lg w-96 text-center bg-white">
        {!isSubmitted ? (
          <Form
            formType={"forgotPassword"}
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            disabled={false} // Set disabled to false directly
            button="Get Started"
            heading1={headingConfigs.forgotPassword.heading1}
            heading2={headingConfigs.forgotPassword.heading2}
            footerConfig={footerConfigs.forgotPassword}
            showDivider={false}
            showTerms={false}
            showAlternateSignup={false}
          />
        ) : (
          <Form
            formType={"resetPassword"}
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            disabled={disabled}
            button="Reset Password"
            heading1={headingConfigs.forgotPassword.heading1}
            heading2={headingConfigs.forgotPassword.heading2}
            footerConfig={footerConfigs.forgotPassword}
            showDivider={false}
            showTerms={false}
            showAlternateSignup={false}
          />
        )}
      </div>
    </div>
  );
}
