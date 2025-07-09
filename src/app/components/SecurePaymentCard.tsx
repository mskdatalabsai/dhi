"use client";
import { CreditCard, Shield, Clock } from "lucide-react";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SecurePaymentCard = ({ isDark, razorpayLoaded }: { isDark: boolean; razorpayLoaded: boolean }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentSuccess = async (response: any) => {
    try {
      const finalData = {
        userId: "user_" + Date.now(),
        timestamp: new Date().toISOString(),
        assessmentFee: 99,
        paymentData: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        },
        completedAt: new Date().toISOString(),
      };
      console.log("Payment completed:", finalData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Payment successful! Redirecting to assessment...");
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error processing successful payment:", error);
      alert("Payment was successful but there was an error. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentFailure = (response: any) => {
    console.error("Payment failed:", response);
    alert("Payment failed. Please try again.");
    setIsSubmitting(false);
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        amount: 9900,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_Hg09l83CTDK2mA",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AI Career Assessment",
        description: "Career Assessment Fee",
        image: "/logo.png",
        handler: function (response: any) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Corporate Office",
        },
        theme: {
          color: "#059669",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            console.log("Payment modal closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", handlePaymentFailure);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl p-8 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}>
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="w-6 h-6 text-purple-600" />
        <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Secure Payment</h3>
      </div>
      <div className={`text-center py-8 px-6 rounded-lg mb-6 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
        <div className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>₹99</div>
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>One-time assessment fee</p>
      </div>
      <div className={`p-4 rounded-lg mb-6 border-l-4 border-teal-500 ${isDark ? "bg-teal-900/20" : "bg-teal-50"}`}>
        <h4 className={`font-semibold mb-2 ${isDark ? "text-teal-300" : "text-teal-800"}`}>Test Mode Information</h4>
        <p className={`text-sm mb-2 ${isDark ? "text-teal-200" : "text-teal-700"}`}>
          This is a test payment. Use these test card details:
        </p>
        <ul className={`text-sm space-y-1 ${isDark ? "text-teal-200" : "text-teal-700"}`}>
          <li>• Card Number: 4111 1111 1111 1111</li>
          <li>• Expiry: Any future date</li>
          <li>• CVV: Any 3 digits</li>
          <li>• Name: Any name</li>
        </ul>
      </div>
      <div className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
        <Shield className="w-5 h-5 text-teal-600" />
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Your payment is secured by Razorpay with 256-bit SSL encryption.
        </p>
      </div>
      <button
        type="button"
        onClick={handleRazorpayPayment}
        disabled={isSubmitting || !razorpayLoaded}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
          isSubmitting || !razorpayLoaded
            ? "bg-purple-300 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white hover:shadow-lg transform hover:scale-[1.02]"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </span>
        ) : !razorpayLoaded ? (
          "Loading Payment System..."
        ) : (
          <span className="flex items-center justify-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ₹99 with Razorpay
          </span>
        )}
      </button>
      <div className="text-center mt-4">
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Powered by <span className="font-semibold text-[#3395ff]">Razorpay</span>
        </p>
      </div>
    </div>
  );
};

export default SecurePaymentCard;
