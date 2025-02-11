import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../components/Button"; // Ensure correct import
import { useAuthStore } from "../store/Auth.store";

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const { error, verifyEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Button clicked");
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully!");
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-tr from-white via-blue-50 to-blue-100">
      <div className="p-6 rounded-2xl shadow-lg w-96 text-center bg-white">
        <h2 className="text-sm font-bold text-left text-primary">
          Verify Your Email
        </h2>
        <p className="text-xs font-light text-left pb-4">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 my-4 pb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <CustomButton
            text="Verify Email"
            color="primary"
            hover_color="hoverAccent"
            variant="filled"
            width="w-full"
            height="h-9"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}
