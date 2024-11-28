"use client"; 
import React, { useEffect, useState } from 'react';
import GlobalApi from '@/app/_utils/GlobalApi';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // Importing Collapsible components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Importing AlertDialog components

function RiderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Confirmed'); // Default filter
    const [activeCollapsible, setActiveCollapsible] = useState(null); // Active collapsible
    const [username, setUsername] = useState(''); // Username state
    const [deliveryproofFile, setDeliveryProofFile] = useState(null); // Proof file state

    // Fetch orders and user data
    useEffect(() => {
        const fetchOrdersAndUser = async () => {
            const jwt = sessionStorage.getItem('jwt');
            if (!jwt) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            try {
                // Fetch user data
                const user = await GlobalApi.getUser(jwt);
                setUsername(user.username);

                // Fetch orders
                const orderData = await GlobalApi.getAllOrders();
                
                // Filter orders based on delivery_assignment matching the username
                const filteredOrders = orderData.filter(order => order.attributes?.delivery_assignment === user.username);
                
                // Sort orders by creation date in descending order
                const sortedOrders = filteredOrders.sort((a, b) => {
                    const dateA = new Date(a.attributes.createdAt).getTime();
                    const dateB = new Date(b.attributes.createdAt).getTime();
                    return dateB - dateA; // Descending
                });

                setOrders(sortedOrders);
            } catch (err) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndUser();
    }, []);

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'All') return true;
        return order.attributes?.status === statusFilter;
    });

    const handleCollapsibleToggle = (orderId) => {
        setActiveCollapsible((prevState) => (prevState === orderId ? null : orderId));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setDeliveryProofFile(file); // Store the selected proof image
    };

    const deliverOrder = async (orderId) => {
        setLoading(true);
        try {
            const jwt = sessionStorage.getItem('jwt');
            if (jwt && deliveryproofFile) {
                // Use the updateDeliverFields function to update the order with the proof image
                await GlobalApi.updateDeliverFields(orderId, { delivery_proof: { data: deliveryproofFile } }, jwt);
                await GlobalApi.deliverOrder(orderId);
                

                // Update the order status in the UI
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, attributes: { ...order.attributes, status: "Delivered" } } : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setLoading(false);
        }
    };

    const pickOrder = async (orderId) => {
        setLoading(true);
        try {
            const jwt = sessionStorage.getItem('jwt');
            if (jwt) {
                // Use the pickOrder function to mark the order as picked up
                await GlobalApi.pickOrder(orderId);

                // Update the order status in the UI
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, attributes: { ...order.attributes, status: "Picked Up" } } : order
                    )
                );
            }
        } catch (error) {
            console.error("Error picking up order:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 sm:p-4">
                <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 sm:p-4">
                <h1 className="text-2xl font-bold mb-4 text-red-600">{error}</h1>
            </div>
        );
    }

    return (
        <div className="p-10 sm:p-4">
            {/* Display the username */}
            <h1 className="text-2xl font-semibold mb-2">Welcome, {username}</h1>
            <h1 className="text-md mb-4">List of orders to process</h1>

            {/* Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                {["Confirmed", "To Ship", "Delivered", "Completed", "Cancelled"].map((status) => (
                    <button 
                        key={status}
                        className={`px-4 py-2 rounded-full ${statusFilter === status ? 'bg-green-500 text-white' : 'bg-green-200'}`}
                        onClick={() => setStatusFilter(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <Collapsible key={order.id} open={activeCollapsible === order.id}>
                            <CollapsibleTrigger 
                                className={`px-6 py-3 text-left font-medium rounded-lg transition-colors duration-300 ease-in-out 
                                ${activeCollapsible === order.id ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                onClick={() => handleCollapsibleToggle(order.id)}
                            >
                                Order ID: {order.id}
                            </CollapsibleTrigger>
                            <CollapsibleContent className={`border p-4 ${activeCollapsible === order.id ? 'bg-green-100' : 'bg-white'}`}>
                                <div className="mb-2 font-bold text-lg">
                                    <strong>Total Amount:</strong> ₱{order.attributes?.totalOrderAmount || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>Payment Method:</strong> {order.attributes?.paymentMethod || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>Username:</strong> {order.attributes?.username || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>Address:</strong> {order.attributes?.address || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>Phone:</strong> {order.attributes?.phone || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>Notes:</strong> {order.attributes?.notes || 'No notes provided'}
                                </div>

                                {/* Show "Pick Up" button if the status is "Confirmed" */}
                                {order.attributes?.status === 'Confirmed' && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full"
                                            >
                                                Pick Up
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Pick Up</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription>
                                                Are you sure you want to mark this order as Picked Up?
                                            </AlertDialogDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={() => pickOrder(order.id)}
                                                >
                                                    Confirm
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                

                                {/* Show "Deliver" button if the status is "To Ship" */}
                                {order.attributes?.status === 'To Ship' && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full"
                                            >
                                                Deliver
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription>
                                                Are you sure you want to mark this order as Delivered?
                                            </AlertDialogDescription>
                                            {/* Input for proof image */}
                                            <div className="mt-4">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleFileChange} 
                                                    className="border p-2 rounded-md"
                                                />
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={() => deliverOrder(order.id)}
                                                >
                                                    Confirm
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
}

export default RiderPage;
