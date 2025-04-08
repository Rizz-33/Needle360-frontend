import { ChevronRight } from "lucide-react";
import React from "react";
import { useAuthStore } from "../store/Auth.store";
import { CustomButton } from "./ui/Button";

const RequestSection = () => {
  const { user } = useAuthStore();

  // Check if the user is a tailor
  const isTailor = user?.role === 4;

  // Content for tailors
  if (isTailor) {
    return (
      <div className="flex flex-col items-center text-center py-20 bg-transparent border-t border-primary">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Your Tailor Dashboard
        </h2>
        <p className="m-8 text-sm text-gray-600 dark:text-gray-300 max-w-lg">
          Thank you for being part of our tailor community! You can manage your
          designs, track orders, and connect with customers directly from your
          dashboard. Let us know if you need any assistance with your shop.
        </p>
        <CustomButton
          text="View Dashboard"
          color="primary"
          hover_color="hoverAccent"
          variant="filled"
          width="w-36"
          height="h-9"
          type="button"
          onClick={() => console.log("View Dashboard Clicked")}
          iconRight={<ChevronRight />}
        />
        <div className="mb-12" />
      </div>
    );
  }

  // Default content for non-tailors
  return (
    <div className="flex flex-col items-center text-center py-20 bg-transparent border-t border-primary">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Become a Tailor with Us
      </h2>
      <p className="m-8 text-sm text-gray-600 dark:text-gray-300 max-w-lg">
        Are you passionate about fashion and design? Join our team of expert
        tailors and start selling your custom-made clothing. We provide the
        platform and support you need to showcase your designs and reach a wider
        audience. Apply now to become a part of our growing community of
        talented tailors.
      </p>
      <CustomButton
        text="Request to Join"
        color="primary"
        hover_color="hoverAccent"
        variant="filled"
        width="w-36"
        height="h-9"
        type="submit"
        onClick={() => console.log("Request to Join Clicked")}
        iconRight={<ChevronRight />}
      />
      <div className="mb-12" />
    </div>
  );
};

export default RequestSection;
