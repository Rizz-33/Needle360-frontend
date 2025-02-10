import { useState } from "react";
import { CustomButton } from "../components/Button"; // Ensure correct import

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
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

        <CustomButton
          text="Verify Email"
          color="primary"
          hover_color="hoverAccent"
          variant="filled"
          width="w-full"
          height="h-9"
        />
      </div>
    </div>
  );
}
