import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../services/orderService";

const OrderDetails = () => {

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const handleCancel = async () => {
        console.log("Cancel button clicked");

        console.log("Skipping confirmation");

        console.log("User confirmed");

        try {
            console.log("Calling API...");
            const updated = await orderService.cancelOrder(order._id);

            console.log("API Success:", updated);

            setOrder(updated);

            alert("Order cancelled successfully.");
        } catch (err) {
            console.error("API Error:", err);
            console.log("Response:", err.response);

            alert(err.response?.data?.message || "Unable to cancel order.");
        }
    };

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await orderService.getById(id);
                setOrder(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadOrder();
    }, [id]);

    if (!order) {
        return (
            <div className="max-w-7xl mx-auto py-20 text-center">
                Loading order...
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-500/20 text-green-400";

            case "out_for_delivery":
                return "bg-blue-500/20 text-blue-400";

            case "shipped":
                return "bg-indigo-500/20 text-indigo-400";

            case "packed":
                return "bg-yellow-500/20 text-yellow-400";

            case "confirmed":
                return "bg-cyan-500/20 text-cyan-400";

            case "cancelled":
                return "bg-red-500/20 text-red-400";

            default:
                return "bg-gray-500/20 text-gray-300";
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case "pending":
                return "Your order has been received.";

            case "confirmed":
                return "Your order has been confirmed.";

            case "packed":
                return "Your order has been packed.";

            case "shipped":
                return "Your package has been shipped.";

            case "out_for_delivery":
                return "Your package is out for delivery.";

            case "delivered":
                return "Your order has been delivered.";

            case "cancelled":
                return "This order has been cancelled.";

            default:
                return "";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="eyebrow mb-2">
                ✦ Order Details
            </div>

            <h1 className="section-title mb-10">
                Order #{order.orderNumber}
            </h1>

            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6 mb-8">

                <div className="flex justify-between items-center">

                    <div>

                        <h2 className="text-xl font-semibold">
                            Status
                        </h2>

                        <p className="text-white/50 mt-2">
                            {getStatusMessage(order.status)}
                        </p>

                    </div>

                    <span
                        className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}
                    >
                        {order.status.replaceAll("_", " ")}
                    </span>

                    <div className="mt-4 text-sm text-white/60 space-y-1">

                        <p>
                            Order Date:
                            {" "}
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>

                        <p>
                            Payment:
                            {" "}
                            {order.paymentStatus}
                        </p>

                        {order.courier && (
                            <p>
                                Courier:
                                {" "}
                                {order.courier}
                            </p>
                        )}

                        {order.trackingNumber && (
                            <p>
                                Tracking No:
                                {" "}
                                {order.trackingNumber}
                            </p>
                        )}

                        {order.estimatedDelivery && (
                            <p className="text-green-400">
                                Estimated Delivery:
                                {" "}
                                {new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}
                            </p>
                        )}

                    </div>

                </div>

            </div>

            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6 mb-8">

                <h2 className="text-2xl font-semibold mb-6">
                    Products
                </h2>

                {order.items.map((item) => (

                    <div
                        key={item.product}
                        className="flex items-center justify-between border-b border-white/10 py-4"
                    >

                        <div className="flex gap-4">

                            <Link to={`/product/${item.product}`}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-xl object-cover hover:scale-105 transition"
                                />
                            </Link>

                            <div>

                                <Link
                                    to={`/product/${item.product}`}
                                    className="font-semibold hover:text-brand-gold"
                                >
                                    {item.name}
                                </Link>

                                <p className="text-white/50">
                                    Qty: {item.qty}
                                </p>

                                {item.size && (
                                    <p className="text-white/50">
                                        Size: {item.size}
                                    </p>
                                )}

                                {item.color && (
                                    <p className="text-white/50">
                                        Color: {item.color}
                                    </p>
                                )}

                            </div>

                        </div>

                        <h3 className="text-brand-gold text-xl">
                            ₹{item.price.toLocaleString("en-IN")}
                        </h3>

                    </div>

                ))}

            </div>

            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6 mb-8">

                <h2 className="text-2xl font-semibold mb-5">
                    Shipping Address
                </h2>

                <p>{order.shippingAddress.fullName}</p>

                <p className="text-white/50">
                    {order.shippingAddress.phone}
                </p>

                <p className="text-white/50">
                    {order.shippingAddress.line1}
                </p>

                {order.shippingAddress.line2 && (
                    <p className="text-white/50">
                        {order.shippingAddress.line2}
                    </p>
                )}

                <p className="text-white/50">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>

                <p className="text-white/50">
                    {order.shippingAddress.pincode}
                </p>

                <p className="text-white/50">
                    {order.shippingAddress.country}
                </p>

            </div>

            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6 mb-8">

                <h2 className="text-2xl font-semibold mb-5">
                    Payment
                </h2>

                <div className="space-y-3">

                    <div className="flex justify-between">
                        <span>Payment Method</span>
                        <span className="uppercase">
                            {order.paymentMethod}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Payment Status</span>
                        <span className="capitalize">
                            {order.paymentStatus}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.itemsPrice.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹{order.shippingPrice.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>₹{order.discountAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{order.taxPrice.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between text-brand-gold font-bold text-xl">
                        <span>Total</span>
                        <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                    </div>

                </div>

            </div>

            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6">

                <h2 className="text-2xl font-semibold mb-6">
                    Order Timeline
                </h2>

                <div className="space-y-5">

                    {order.trackingSteps.map((step) => (

                        <div
                            key={step.label}
                            className="flex justify-between items-center"
                        >

                            <div>

                                {step.completed ? "✅" : "⏳"} {step.label}

                            </div>

                            <div className="text-sm text-white/50">

                                {step.completedAt &&
                                    new Date(step.completedAt).toLocaleString("en-IN")}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <div className="flex flex-wrap gap-4 mt-10">

                <button className="btn-primary">
                    Download Invoice
                </button>

                <button className="btn-outline">
                    Buy Again
                </button>

                {["pending", "confirmed", "packed"].includes(order.status) && (
                    <button
                        onClick={handleCancel}
                        className="btn-outline text-red-400"
                    >
                        Cancel Order
                    </button>
                )}

                <Link
                    to="/profile?tab=orders"
                    className="btn-outline"
                >
                    Back to Orders
                </Link>

            </div>

        </div>
    );
};

export default OrderDetails;