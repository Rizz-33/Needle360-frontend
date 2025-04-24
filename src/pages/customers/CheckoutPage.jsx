import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  CreditCard,
  DollarSign,
  Loader as LoaderIcon,
  MapPin,
  Package,
  Phone,
  Store,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BankCard from "../../components/ui/BankCard";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useOrderStore } from "../../store/Order.store";
import { useShopStore } from "../../store/Shop.store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ order, clientSecret, onSuccess }) => {
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
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Payment failed");
      toast.error(err.message || "Payment failed");
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

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": {
                  color: "#9ca3af",
                },
                padding: "10px",
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <CustomButton
          type="submit"
          text={isProcessing ? "Processing Payment..." : "Pay Now"}
          color="primary"
          variant="filled"
          width="w-full"
          height="h-8"
          size="lg"
          disabled={isProcessing || !stripe || !elements}
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

const CheckoutPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, createPaymentIntent, selectCOD, isLoading, error } =
    useOrderStore();
  const {
    fetchTailorById,
    tailor,
    isLoading: tailorLoading,
    error: tailorError,
  } = useShopStore();
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const method = queryParams.get("method");
    setPaymentMethod(method);

    if (!orderId) {
      toast.error("No order selected");
      navigate("/checkout");
      return;
    }

    const foundOrder = orders.find((o) => o._id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);

      // Fetch tailor details if we have a tailor ID
      if (foundOrder.tailor) {
        fetchTailorById(foundOrder.tailor);
      }

      if (foundOrder.paymentStatus === "paid") {
        toast.error("This order is already paid");
        navigate("/user/orders");
      }
    } else {
      toast.error("Order not found");
      navigate("/user/orders");
    }
  }, [orderId, orders, navigate, location.search, fetchTailorById]);

  useEffect(() => {
    if (paymentMethod === "card" && order && !clientSecret) {
      const initPayment = async () => {
        try {
          setIsProcessing(true);
          const { clientSecret } = await createPaymentIntent(order._id);
          setClientSecret(clientSecret);
        } catch (err) {
          toast.error(err.message || "Error initiating payment");
          navigate(`/checkout/${orderId}`);
        } finally {
          setIsProcessing(false);
        }
      };
      initPayment();
    }
  }, [
    paymentMethod,
    order,
    clientSecret,
    createPaymentIntent,
    orderId,
    navigate,
  ]);

  const handleCODPayment = async () => {
    try {
      setIsProcessing(true);
      await selectCOD(order._id);
      toast.success("COD selected successfully! You will pay upon delivery.");
      navigate("/user/orders");
    } catch (err) {
      toast.error(err.message || "Error selecting COD");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment successful!");
    navigate("/user/orders");
  };

  if (
    isLoading ||
    tailorLoading ||
    !order ||
    (paymentMethod === "card" && !clientSecret)
  ) {
    return (
      <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || tailorError) {
    return (
      <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error || tailorError}</p>
          <CustomButton
            onClick={() => navigate(`/checkout/${orderId}`)}
            text="Back to Order Summary"
            color="primary"
            variant="filled"
            width="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-auto w-full bg-gradient-to-br from-blue-50 via-secondary/20 to-blue-100 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto"
      >
        <div className="relative flex items-center justify-center mb-8">
          {/* Back Arrow - absolutely positioned on the left */}
          <div
            className="absolute left-0 flex items-center cursor-pointer"
            onClick={() => navigate(`/checkout/${orderId}`)}
          >
            <ChevronLeft size={20} className="text-gray-600 mr-2" />
          </div>

          {/* Centered Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {paymentMethod === "card" ? "Secure Payment" : "Cash on Delivery"}
            </h1>
            <p className="text-gray-500 text-xs">
              {paymentMethod === "card"
                ? "Enter your card details to complete the payment"
                : "You'll pay when you receive the order"}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary Section (2/3 width) */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #...{order._id?.slice(-6) || ""}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {order.orderType || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">
                          Due Date
                        </h3>
                        <p className="text-gray-800 font-medium text-sm">
                          {order.dueDate
                            ? new Date(order.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">
                          Total Amount
                        </h3>
                        <p className="text-2xl font-bold text-gray-800">
                          LKR {order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {tailor && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
                      <Store className="mr-2" size={20} />
                      Tailor Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                        {tailor.logoUrl && (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={tailor.logoUrl}
                              alt={`${tailor.shopName} logo`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1">
                            Shop Name
                          </h4>
                          <p className="text-gray-800 font-medium text-sm">
                            {tailor.shopName || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-xs font-medium text-gray-500 mb-1">
                          Contact Number
                        </h4>
                        <p className="text-gray-800 flex items-center text-sm">
                          <Phone className="mr-2" size={16} />
                          {tailor.contactNumber || "Not provided"}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                        <h4 className="text-xs font-medium text-gray-500 mb-1">
                          Address
                        </h4>
                        <p className="text-gray-800 flex items-start text-sm">
                          <MapPin
                            className="mr-2 mt-1 flex-shrink-0"
                            size={16}
                          />
                          <span>{tailor.shopAddress || "Not provided"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section (1/3 width) */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {paymentMethod === "card"
                    ? "Card Details"
                    : "Confirm Delivery"}
                </h2>

                {paymentMethod === "card" ? (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      order={order}
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="bg-purple-100 p-5 rounded-full mb-4">
                        <Package className="text-purple-600" size={32} />
                      </div>
                      <p className="text-gray-600 text-center mb-6">
                        You'll pay{" "}
                        <span className="font-bold">
                          LKR {order.totalAmount.toFixed(2)}
                        </span>{" "}
                        when you receive your order.
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CustomButton
                        onClick={handleCODPayment}
                        text={
                          isProcessing
                            ? "Confirming..."
                            : "Confirm Cash on Delivery"
                        }
                        color="primary"
                        variant="filled"
                        width="w-full"
                        height="h-8"
                        size="lg"
                        disabled={isProcessing}
                        icon={
                          isProcessing ? (
                            <LoaderIcon className="animate-spin" size={20} />
                          ) : (
                            <Package size={20} />
                          )
                        }
                      />
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      LKR {order.totalAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">LKR 0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Total</span>
                    <span className="text-gray-900 font-bold">
                      LKR {order.totalAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
