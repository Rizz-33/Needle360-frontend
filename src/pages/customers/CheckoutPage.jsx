import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useAuthStore } from "../../store/Auth.store";
import { useOrderStore } from "../../store/Order.store";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ order, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
      }
    } catch (err) {
      setError(err.message || "Payment failed");
      toast.error(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="border border-gray-300 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <CustomButton
        type="submit"
        text={isProcessing ? "Processing..." : "Pay Now"}
        color="primary"
        hover_color="hoverAccent"
        variant="filled"
        width="w-full"
        height="h-10"
        disabled={isProcessing || !stripe || !elements}
      />
    </form>
  );
};

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    orders,
    createPaymentIntent,
    selectCOD,
    isLoading,
    error,
    paymentOrderId,
  } = useOrderStore();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [clientSecret, setClientSecret] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const targetOrderId = orderId || paymentOrderId;
      if (!targetOrderId) {
        toast.error("No order selected for payment");
        navigate("/profile");
        return;
      }

      const foundOrder = orders.find((o) => o._id === targetOrderId);
      if (foundOrder) {
        setOrder(foundOrder);
        if (foundOrder.paymentStatus === "paid") {
          toast.error("This order is already paid");
          navigate("/profile");
        }
      } else {
        toast.error("Order not found");
        navigate("/profile");
      }
    };

    fetchOrderDetails();
  }, [orderId, paymentOrderId, orders, navigate]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setClientSecret(null);
  };

  const handleProceed = async () => {
    if (!order) return;

    try {
      if (paymentMethod === "stripe") {
        const { clientSecret } = await createPaymentIntent(order._id);
        setClientSecret(clientSecret);
      } else if (paymentMethod === "cod") {
        await selectCOD(order._id);
        toast.success("COD selected successfully! You will pay upon delivery.");
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err.message || "Error initiating payment");
    }
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Checkout</h2>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600">Order Details</h3>
          <p className="text-gray-800">Order ID: {order._id}</p>
          <p className="text-gray-800">Type: {order.orderType}</p>
          <p className="text-gray-800">
            Total: LKR {order.totalAmount.toFixed(2)}
          </p>
          <p className="text-gray-800">
            Due Date: {new Date(order.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Payment Method
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handlePaymentMethodChange("stripe")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                paymentMethod === "stripe"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Card (Stripe)
            </button>
            <button
              onClick={() => handlePaymentMethodChange("cod")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                paymentMethod === "cod"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
        {paymentMethod === "stripe" && !clientSecret && (
          <CustomButton
            onClick={handleProceed}
            text="Proceed to Payment"
            color="primary"
            hover_color="hoverAccent"
            variant="filled"
            width="w-full"
            height="h-10"
            disabled={isLoading}
          />
        )}
        {paymentMethod === "cod" && (
          <CustomButton
            onClick={handleProceed}
            text="Confirm COD"
            color="primary"
            hover_color="hoverAccent"
            variant="filled"
            width="w-full"
            height="h-10"
            disabled={isLoading}
          />
        )}
        {paymentMethod === "stripe" && clientSecret && (
          <Elements stripe={stripePromise}>
            <CheckoutForm order={order} clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
