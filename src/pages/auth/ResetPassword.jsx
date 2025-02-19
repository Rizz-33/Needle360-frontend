import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/Form";
import { headingConfigs } from "../../configs/Form.configs";
import { useAuthStore } from "../../store/Auth.store";

export default function ResetPassword() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const { resetPassword, error, isLoading } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  // Handle input changes and update state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form fields
      if (!values.password || !values.confirmPassword) {
        setErrors({
          submit: "Please fill in all the fields.",
        });
        return;
      }

      // Call resetPassword function from auth store
      await resetPassword(token, values.password);

      // Show success message and redirect to login page
      toast.success(
        "Password reset successfully! Redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error during reset password request:", error);
      toast.error("An error occurred during password reset.");
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-tr from-white via-blue-50 to-blue-100">
      <div className="p-6 rounded-2xl shadow-lg w-96 text-center bg-white">
        <Form
          formType="resetPassword"
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
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
