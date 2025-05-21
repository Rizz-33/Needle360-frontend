import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  MapPin,
  Package,
  Phone,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import BankCard from "../../components/ui/BankCard";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useOrderStore } from "../../store/Order.store";
import { useShopStore } from "../../store/Shop.store";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    orders,
    isLoading: orderLoading,
    error: orderError,
  } = useOrderStore();
  const {
    fetchTailorById,
    tailor,
    isLoading: tailorLoading,
    error: tailorError,
  } = useShopStore();
  const [order, setOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const isLoading = orderLoading || tailorLoading;
  const error = orderError || tailorError;

  useEffect(() => {
    if (!orderId) {
      toast.error("No order selected");
      navigate("/");
      return;
    }

    const foundOrder = orders.find((o) => o._id === orderId);
    if (foundOrder) {
      setOrder({
        ...foundOrder,
        measurements: foundOrder.measurements || new Map(),
      });

      // Fetch tailor details if we have a tailor ID
      if (foundOrder.tailor) {
        fetchTailorById(foundOrder.tailor);
      }

      if (foundOrder.paymentStatus === "paid") {
        toast.error("This order is already paid");
        navigate("/");
      }
    } else {
      toast.error("Order not found");
      navigate("/");
    }
  }, [orderId, orders, navigate, fetchTailorById]);

  const handleProceed = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    navigate(`/checkout/payment/${orderId}?method=${selectedPaymentMethod}`);
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <CustomButton
            onClick={() => navigate("/")}
            text="Back to Orders"
            color="primary"
            variant="filled"
            width="w-full"
            height="h-12"
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
          <p className="text-gray-500 text-xs">
            Review your order details before payment
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Details Section (2/3 width) */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #...{order._id?.slice(-6) || ""}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status?.toUpperCase() || "N/A"}
                    </span>
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

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">
                          Created At
                        </h3>
                        <p className="text-gray-800 font-medium text-sm">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
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

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">
                          Payment Status
                        </h3>
                        <p
                          className={`font-medium ${
                            order.paymentStatus === "paid"
                              ? "text-green-600"
                              : order.paymentStatus === "failed"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.paymentStatus?.toUpperCase() || "PENDING"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
                    <Store className="mr-2" size={20} />
                    Tailor Details
                  </h3>
                  {tailor ? (
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
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        Tailor information not available
                      </p>
                    </div>
                  )}
                </div>

                {order.measurements && order.measurements.size > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Measurements
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Array.from(order.measurements.entries()).map(
                        ([key, value]) => (
                          <div key={key} className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {key}
                            </h4>
                            <p className="text-gray-800 font-medium text-sm">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Additional Notes
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm">
                        {order.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section (1/3 width) */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden top-6">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPaymentMethod("card")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <CreditCard className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Credit/Debit Card
                          </h3>
                          <p className="text-xs text-gray-500">
                            Pay securely with your card
                          </p>
                        </div>
                      </div>
                      {selectedPaymentMethod === "card" && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <CheckCircle className="text-white" size={16} />
                        </div>
                      )}
                    </div>

                    {selectedPaymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <BankCard interactive={true} cardType="visa" />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPaymentMethod("cod")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Package className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Cash on Delivery
                          </h3>
                          <p className="text-xs text-gray-500">
                            Pay when you receive the order
                          </p>
                        </div>
                      </div>
                      {selectedPaymentMethod === "cod" && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <CheckCircle className="text-white" size={16} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-8"
                >
                  <CustomButton
                    onClick={handleProceed}
                    text="Proceed to Payment"
                    color="primary"
                    hover_color="hoverAccent"
                    variant="filled"
                    width="w-full"
                    height="h-12"
                    size="lg"
                    disabled={!selectedPaymentMethod}
                    iconRight={<ChevronRight size={20} />}
                  />
                </motion.div>
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

export default OrderDetails;
