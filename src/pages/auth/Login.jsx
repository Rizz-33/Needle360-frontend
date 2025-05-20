import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { CustomButton } from "../../components/ui/Button";
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
  const { login, googleLogin, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const user = query.get("user");
    const error = query.get("error");

    if (error) {
      setErrors({ auth: "Google authentication failed. Please try again." });
      return;
    }

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        googleLogin(token, userData).then(() => {
          navigate(userData.isVerified ? "/" : "/verify-email", {
            replace: true,
          });
        });
      } catch (err) {
        setErrors({ auth: "Failed to process Google authentication." });
      }
    }
  }, [location, googleLogin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleRoleTypeChange = (newRoleType) => {
    setRoleType(newRoleType);
  };

  const handleSubmit = async (formValues) => {
    try {
      const result = await login(formValues.email, formValues.password);
      if (result.user.role !== roleType) {
        setErrors({
          auth: `Invalid credentials for ${
            roleType === 1 ? "Customer" : roleType === 4 ? "Tailor" : "Admin"
          } account.`,
        });
        return;
      }
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({ auth: error.message || "Login failed." });
    }
  };

  const handleGoogleLogin = () => {
    if (roleType !== 1) {
      setErrors({ auth: "Google login is only available for customers." });
      return;
    }
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:4000"
    }/api/auth/google?role=${roleType}`;
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
                : roleType === 4
                ? headingConfigs.tailorLogin.heading1
                : headingConfigs.adminLogin.heading1
            }
            heading2={
              roleType === 1
                ? headingConfigs.customerLogin.heading2
                : roleType === 4
                ? headingConfigs.tailorLogin.heading2
                : headingConfigs.adminLogin.heading2
            }
            footerConfig={
              roleType === 1
                ? footerConfigs.customerLogin
                : roleType === 4
                ? footerConfigs.tailorLogin
                : footerConfigs.adminLogin
            }
            onRoleTypeChange={handleRoleTypeChange}
          />
          <div className="mt-8 text-center">
            {roleType === 1 && (
              <CustomButton
                text="Continue with Google"
                color="primary"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-full"
                height="h-9"
                type="button"
                onClick={handleGoogleLogin}
                className="mt-2"
                iconLeft={
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                }
              />
            )}
          </div>
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
