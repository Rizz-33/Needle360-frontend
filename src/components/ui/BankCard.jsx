import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css"; // Import styles
import { useAuthStore } from "../../store/Auth.store";

const BankCard = ({
  interactive = true,
  cardType = "visa", // visa, mastercard, amex
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Get user data from useAuthStore
  const { user, isAuthenticated } = useAuthStore();

  // Fallback values if user is not authenticated or data is missing
  const cardholderName = user?.name || "John Doe";
  const bankAccountNumber = user?.bankAccountNumber || "4111111111111111";
  const lastFourDigits = bankAccountNumber.slice(-4) || "1111";
  const expiry = "12/27"; // Hardcoded; fetch from backend if available
  const cvc = "123"; // Hardcoded; fetch from backend if available

  // Handle card flip on click
  const handleCardClick = () => {
    if (interactive) {
      setIsFlipped(!isFlipped);
    }
  };

  // Validate card number length
  useEffect(() => {
    if (bankAccountNumber.length < 16) {
      console.warn(
        "Bank account number should be at least 16 digits for card rendering."
      );
    }
  }, [bankAccountNumber]);

  return (
    <div
      className="relative w-full"
      style={{ maxWidth: "400px", margin: "0 auto" }}
      onClick={handleCardClick}
    >
      <Cards
        number={bankAccountNumber}
        expiry={expiry}
        cvc={cvc}
        name={cardholderName}
        focused={isFlipped ? "cvc" : "number"} // Controls flip state
        acceptedCards={[cardType]} // Restrict to specified card type
      />
      {interactive && (
        <p className="text-center text-xs text-gray-500 mt-2">
          {isFlipped ? "Click to see front" : "Click to see back"}
        </p>
      )}
    </div>
  );
};

export default BankCard;
