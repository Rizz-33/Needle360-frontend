import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/Button";
import { roleTypes } from "../../configs/User.config";
import { useAuthStore } from "../../store/Auth.store";

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const { error, verifyEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numeric values

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if a number is entered
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (!newCode[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").slice(0, 6); // Take only the first 6 digits
    if (!/^\d{1,6}$/.test(pastedText)) return; // Allow only numeric values

    const newCode = [...code];
    pastedText.split("").forEach((char, i) => {
      newCode[i] = char;
    });

    setCode(newCode);

    // Move focus to the last filled input
    inputsRef.current[Math.min(pastedText.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      roleTypes === 1 ? navigate("/") : navigate("/pending-approval");
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
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
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
