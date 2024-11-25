"use client";
import React, { useEffect, useState } from 'react';
import GlobalApi from '@/app/_utils/GlobalApi';

function AdminDashboard() {
    const [orders, setOrders] = useState([]); // State for storing orders
    const [loading, setLoading] = useState(true); // Loading state
    const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
    const [filterDateRange, setFilterDateRange] = useState(''); // Date range filter
    const [totalAmount, setTotalAmount] = useState(0); // Total amount of filtered orders

    // Fetch all orders with "Completed" status on component mount
    useEffect(() => {
        GlobalApi.getAllOrders()
            .then(fetchedOrders => {
                // Filter orders to only include completed ones
                const completedOrders = fetchedOrders.filter(order => order.attributes.status === 'Completed');
                setOrders(completedOrders); // Set orders in state
                setFilteredOrders(sortOrders(completedOrders)); // Initially, show all completed orders sorted by date
                calculateTotal(completedOrders); // Calculate total for all completed orders
                setLoading(false); // Stop loading
            })
            .catch(error => {
                console.error("Error loading orders:", error);
                setLoading(false);
            });
    }, []);

    // Sort orders by the latest date first (descending)
    const sortOrders = (ordersList) => {
        return ordersList.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));
    };

    // Filter orders by date range (Daily, Weekly, Monthly, Yearly)
    const handleFilterDateRangeChange = (event) => {
        const selectedRange = event.target.value;
        setFilterDateRange(selectedRange);

        const currentDate = new Date();
        let startDate;

        // Determine the start date based on the selected range
        switch (selectedRange) {
            case 'daily':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                break;
            case 'weekly':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                break;
            case 'monthly':
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                break;
            case 'yearly':
                startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                break;
            default:
                startDate = null; // No filter
                break;
        }

        let filtered = orders;

        if (startDate) {
            filtered = orders.filter(order => {
                const orderDate = new Date(order.attributes.createdAt);
                return orderDate >= startDate;
            });
        }

        // Sort the filtered orders by the latest first
        setFilteredOrders(sortOrders(filtered));
        calculateTotal(filtered);
    };

    // Calculate the total order amount
    const calculateTotal = (ordersList) => {
        const total = ordersList.reduce((sum, order) => {
            return sum + (order.attributes.totalOrderAmount || 0);
        }, 0);
        setTotalAmount(total);
    };

    return (
        <div className="p-10 ml-56 mr-56">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-6">View all completed orders below:</p>

            {/* Date Range Filter */}
            <div className="mb-4">
                <label htmlFor="filterDateRange" className="mr-2 font-semibold">Filter by Date Range:</label>
                <select
                    id="filterDateRange"
                    value={filterDateRange}
                    onChange={handleFilterDateRangeChange}
                    className="border border-gray-300 rounded px-2 py-1"
                >
                    <option value="">All Time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <div>
                    {filteredOrders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <>
                            <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Order ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Customer</th>
                                        <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                                        <th className="border border-gray-300 px-4 py-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                                            <td className="border border-gray-300 px-4 py-2">{order.attributes.username || "N/A"}</td>
                                            <td className="border border-gray-300 px-4 py-2">₱{order.attributes.totalOrderAmount || "0.00"}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {new Date(order.attributes.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Total Amount */}
                            <div className="font-bold text-2xl text-green-800">
                                Total Order Amount: ₱{totalAmount.toFixed(2)}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
