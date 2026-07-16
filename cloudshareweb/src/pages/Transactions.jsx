import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../layout/DashboardLayout";
import { api } from "../util/api";


const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { getToken } = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError("");

            try {
                const token = await getToken();

                const response = await axios.get(api.GET_TRANSACTIONS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setTransactions(response.data);

            } catch (err) {
                console.error("Failed to fetch transactions:", err);
                setError("Failed to load transaction history.");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <DashboardLayout activeMenu="Transactions">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

                {loading && <p className="text-gray-500">Loading transactions...</p>}

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <p className="text-gray-500">No transactions yet.</p>
                )}

                {!loading && !error && transactions.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.orderId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            {transaction.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{transaction.planId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {transaction.amount} {transaction.currency}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.credits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    transaction.success
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {transaction.success ? "Success" : "Failed"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Transactions;