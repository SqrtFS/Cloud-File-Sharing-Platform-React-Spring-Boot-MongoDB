import { useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../layout/DashboardLayout";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { api } from "../util/api";


const Subscription = () => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success or error
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const { getToken } = useAuth();
    const { credits, setCredits, fetchUserCredits } = useContext(UserCreditsContext);

    const plans = [
        {
            id: "premium",
            name: "Premium",
            credits: 500,
            price: 500,
            features: [
                "Upload up to 500 files",
                "Access to all basic features",
                "Priority support"
            ],
            recommended: false
        },
        {
            id: "ultimate",
            name: "Ultimate",
            credits: 5000,
            price: 2500,
            features: [
                "Upload up to 5000 files",
                "Access to all premium features",
                "Priority support",
                "Advanced analytics"
            ],
            recommended: true
        }
    ];

    const handleSubscribe = async (plan) => {
        setProcessingPayment(true);
        setSelectedPlanId(plan.id);
        setMessage("");
        setMessageType("");

        try {
            const token = await getToken();

            const createOrderResponse = await axios.post(
                api.CREATE_ORDER,
                {
                    planId: plan.id,
                    amount: plan.price,
                    currency: "USD",
                    credits: plan.credits
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const orderData = createOrderResponse.data;

            if (!orderData.success) {
                setMessage(orderData.message || "Failed to create order");
                setMessageType("error");
                return;
            }

            const captureResponse = await axios.post(
                api.CAPTURE_ORDER(orderData.orderId),
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const captureData = captureResponse.data;

            if (captureData.success) {
                setMessage(captureData.message || "Payment successful");
                setMessageType("success");
                setCredits(captureData.credits);
                await fetchUserCredits();
            } else {
                setMessage(captureData.message || "Payment failed");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            setMessage("Something went wrong. Please try again.");
            setMessageType("error");
        } finally {
            setProcessingPayment(false);
            setSelectedPlanId(null);
        }
    };

    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
                <p className="text-gray-500 mb-6">Current credits: {credits}</p>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded ${
                            messageType === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`border rounded-lg p-6 ${
                                plan.recommended ? "border-blue-500 shadow-lg" : "border-gray-200"
                            }`}
                        >
                            {plan.recommended && (
                                <span className="text-xs font-semibold text-blue-500 uppercase">
                                    Recommended
                                </span>
                            )}
                            <h2 className="text-xl font-bold mt-2">{plan.name}</h2>
                            <p className="text-3xl font-bold mt-2">${plan.price}</p>
                            <p className="text-gray-500 mb-4">{plan.credits} credits</p>

                            <ul className="mb-6 space-y-2">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                        • {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={processingPayment}
                                className={`w-full py-2 rounded font-semibold ${
                                    plan.recommended
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                } disabled:opacity-50`}
                            >
                                {processingPayment && selectedPlanId === plan.id
                                    ? "Processing..."
                                    : "Subscribe"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Subscription;