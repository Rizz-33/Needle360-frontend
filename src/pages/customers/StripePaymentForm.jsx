import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CreditCard, Loader as LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import BankCard from "../../components/ui/BankCard";
import { CustomButton } from "../../components/ui/Button";

const StripePaymentForm = ({ order, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Handle card input change
  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  // Enhanced submit handler with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError(
        "Stripe is not initialized. Please refresh the page and try again."
      );
      return;
    }

    if (!clientSecret) {
      setError(
        "Payment cannot be processed at this time. Please try again later."
      );
      return;
    }

    if (!cardComplete) {
      setError("Please complete your card information before submitting.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Show processing toast
      const processingToast = toast.loading("Processing payment...");

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: order.customerName || "Customer", // Use customer name if available
              email: order.customerEmail || undefined,
            },
          },
        });

      // Dismiss the processing toast
      toast.dismiss(processingToast);

      // Handle Stripe errors
      if (stripeError) {
        console.error("Stripe payment error:", stripeError);
        let errorMessage = stripeError.message || "Payment failed";

        // Provide more specific error messages for common issues
        if (stripeError.code === "card_declined") {
          errorMessage =
            "Your card was declined. Please try another payment method.";
        } else if (stripeError.code === "expired_card") {
          errorMessage = "Your card has expired. Please try another card.";
        } else if (stripeError.code === "incorrect_cvc") {
          errorMessage =
            "The CVC code is incorrect. Please check and try again.";
        } else if (stripeError.code === "processing_error") {
          errorMessage =
            "An error occurred while processing your card. Please try again.";
        } else if (stripeError.code === "incomplete_number") {
          errorMessage =
            "Your card number is incomplete. Please check and try again.";
        }

        setError(errorMessage);
        toast.error(errorMessage);
        setIsProcessing(false);
        return;
      }

      // Handle success
      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful! Your order has been confirmed.");
        onSuccess();
      } else if (paymentIntent.status === "requires_action") {
        // Handle additional authentication if needed
        toast.loading("Additional verification required...");
        const { error: actionError, paymentIntent: verifiedPaymentIntent } =
          await stripe.confirmCardPayment(clientSecret);

        if (actionError) {
          setError(actionError.message || "Additional authentication failed");
          toast.error(
            actionError.message || "Additional authentication failed"
          );
        } else if (verifiedPaymentIntent.status === "succeeded") {
          toast.success("Payment successful! Your order has been confirmed.");
          onSuccess();
        } else {
          setError(
            `Payment status: ${verifiedPaymentIntent.status}. Please try again.`
          );
          toast.error(`Payment could not be completed. Please try again.`);
        }
      } else {
        // Handle other statuses
        setError(`Payment status: ${paymentIntent.status}. Please try again.`);
        toast.error(`Payment could not be completed. Please try again.`);
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
      toast.error(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <BankCard interactive={true} cardType="visa" />
      </div>

      {/* Card input with improved styling */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                fontFamily: '"Segoe UI", Roboto, sans-serif',
                fontSmoothing: "antialiased",
                "::placeholder": {
                  color: "#9ca3af",
                },
                padding: "10px",
              },
              invalid: {
                color: "#dc2626",
                iconColor: "#dc2626",
              },
            },
            hidePostalCode: true,
          }}
          onChange={handleCardChange}
        />
      </div>

      <div className="text-sm text-gray-500 mb-4">
        <p>For testing, use these card details:</p>
        <p>Card number: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date | CVC: Any 3 digits</p>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <CustomButton
          type="submit"
          text={isProcessing ? "Processing Payment..." : "Pay Now"}
          color="primary"
          variant="filled"
          width="w-full"
          height="h-12"
          size="lg"
          disabled={
            isProcessing ||
            !stripe ||
            !elements ||
            !cardComplete ||
            !clientSecret
          }
          icon={
            isProcessing ? (
              <LoaderIcon className="animate-spin" size={20} />
            ) : (
              <CreditCard size={20} />
            )
          }
        />
      </motion.div>
    </form>
  );
};

export default StripePaymentForm;
