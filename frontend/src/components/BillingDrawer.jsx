import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Crown } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import api from "../../utils/axios";
import { verifyPayment } from "../features/verifyPayments";

function BillingDrawer({ open, onClose }) {
    const { userData } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    // Handle Plan Upgrade
    const handleUpgrade = async (plan) => {
        try {
            setLoading(true);

            // 1. Create order from backend
            const data = await createOrder(plan);

            console.log("Backend Order Response:", data);

            // 2. Validate order
            if (!data?.order?.id) {
                throw new Error("Razorpay Order ID is missing!");
            }

            if (!window.Razorpay) {
                throw new Error("Razorpay SDK is not loaded!");
            }

            // 3. Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "CortexAI",
                description: `${data.plan.name} Plan`,
                order_id: data.order.id,

                // 4. Payment Success Handler
                handler: async (response) => {

                    const {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature
                    } = response;

                    if (
                        !razorpay_payment_id ||
                        !razorpay_order_id ||
                        !razorpay_signature
                    ) {
                        console.error("Missing payment details:", response);
                        alert("Incomplete payment response. Please contact support.");
                        return;
                    }

                    // 5. Verify payment on backend
                    try {
                        const data = await verifyPayment(response)
                           
                        console.log("Verification Result:", data);

                        alert("Payment successful! Your plan has been upgraded.");

                        onClose();

                    } catch (error) {
                        console.error(
                            "Verification Error:",
                            error.response?.data || error.message
                        );

                        alert("Payment verification failed.");
                    }
                },

                theme: {
                    color: "#4F46E5"
                },

                modal: {
                    ondismiss: () => {
                        console.log("Razorpay checkout closed.");
                    }
                }
            };

            // 6. Open Razorpay Checkout
            console.log("Razorpay Order ID:", options.order_id);

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", (response) => {
                console.error("Payment Failed:", response.error);

                alert(
                    response.error.description || "Payment failed."
                );
            });

            razorpay.open();

        } catch (error) {
            console.error(
                "Upgrade Error:",
                error.response?.data || error.message
            );

            alert(error.message || "Something went wrong.");

        } finally {
            setLoading(false);
        }
    };

    // Component UI
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Drawer Container */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.25 }}
                        className="fixed right-0 top-0 z-50 h-screen w-[380px] max-w-full bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <div>
                                <div className="text-white font-semibold">
                                    Billing
                                </div>

                                <div className="text-slate-400 text-sm">
                                    Plans & Credits
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                            >
                                <X size={18} className="text-slate-300" />
                            </button>
                        </div>

                        {/* Current Plan & Credits */}
                        <div className="p-5">
                            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-slate-400 text-sm">
                                            Current Plan
                                        </p>

                                        <h3 className="text-white text-xl font-bold capitalize">
                                            {userData?.plan || "free"}
                                        </h3>
                                    </div>

                                    <Crown className="text-yellow-400" />
                                </div>

                                <div className="mt-5">
                                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                                        <span>Credits</span>

                                        <span>
                                            {userData?.credits || 0}/
                                            {userData?.totalCredits || 100}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 transition-all duration-300"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    ((userData?.credits || 0) /
                                                        (userData?.totalCredits || 100)) *
                                                    100
                                                )
                                                    }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Plans List */}
                        <div className="px-5 flex-1 overflow-auto space-y-4">

                            {/* Starter Plan */}
                            <div className="rounded-xl border border-white/10 p-4">
                                <h3 className="text-white font-semibold">
                                    Starter Plan
                                </h3>

                                <p className="text-indigo-400 text-2xl font-bold mt-2">
                                    ₹199
                                </p>

                                <p className="text-slate-400 text-sm mt-1">
                                    500 Credits
                                </p>

                                <button
                                    disabled={loading}
                                    className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2"
                                    onClick={() => handleUpgrade("starter")}
                                >
                                    {loading ? "Processing..." : "Upgrade"}
                                </button>
                            </div>

                            {/* Pro Plan */}
                            <div className="rounded-xl border border-white/10 p-4">
                                <h3 className="text-white font-semibold">
                                    Pro Plan
                                </h3>

                                <p className="text-indigo-400 text-2xl font-bold mt-2">
                                    ₹499
                                </p>

                                <p className="text-slate-400 text-sm mt-1">
                                    1000 Credits
                                </p>

                                <button
                                    disabled={loading}
                                    className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2"
                                    onClick={() => handleUpgrade("pro")}
                                >
                                    {loading ? "Processing..." : "Upgrade"}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default BillingDrawer;