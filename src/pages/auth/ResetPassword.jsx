import { useState } from "react";
import Form from "../../components/Form";
import { headingConfigs } from "../../configs/Form.configs";
import { useAuthStore } from "../../store/Auth.store";

export default function ResetPassword() {
  const [values, setValues] = useState({}); // Define values state
  const [errors, setErrors] = useState({}); // Define errors state

  const { resetPassword } = useAuthStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = async () => {
    try {
      await resetPassword(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error during reset password request:", error);
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
        <Form
          formType={"resetPassword"}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          button="Reset Password"
          heading1={headingConfigs.resetPassword.heading1}
          heading2={headingConfigs.resetPassword.heading2}
          showTerms={false}
          showAlternateSignup={false}
        />
      </div>
    </div>
  );
}
