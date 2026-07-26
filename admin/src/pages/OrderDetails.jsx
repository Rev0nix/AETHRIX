import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import api from "../services/api";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [courier, setCourier] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");

    useEffect(() => {
        api.get(`/orders/${id}`).then((res) => {
            setOrder(res.data.data);
            setStatus(res.data.data.status);
            setCourier(res.data.data.courier || "");
            setTrackingNumber(res.data.data.trackingNumber || "");
        });
    }, [id]);

    if (!order) {
        return <div className="p-8">Loading...</div>;
    }

    const updateOrderStatus = async () => {
        try {
            await api.put(`/orders/${id}/status`, {
                status,
                courier,
                trackingNumber,
            });

            const res = await api.get(`/orders/${id}`);
            setOrder(res.data.data);
            setStatus(res.data.data.status);
            setCourier(res.data.data.courier || "");
            setTrackingNumber(res.data.data.trackingNumber || "");

            alert("Order updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update order.");
        }
    };

    return (
        <div>

            <Topbar
                title={`Order ${order.orderNumber}`}
            />

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left */}

                <div className="lg:col-span-2 space-y-6">

                    {/* Customer */}

                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-4">
                            Customer
                        </h2>

                        <p>{order.user?.name}</p>
                        <p className="text-white/60">
                            {order.user?.email}
                        </p>

                    </div>

                    <div className="flex gap-3 mt-4">

                        <a
                            href={`mailto:${order.user?.email}`}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                            Email
                        </a>

                        <a
                            href={`tel:${order.shippingAddress.phone}`}
                            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-sm"
                        >
                            Call
                        </a>

                    </div>

                    {/* Shipping Address */}

                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-4">
                            Shipping Address
                        </h2>

                        Subtotal
                        ₹{order.itemsPrice.toLocaleString("en-IN")}

                        Shipping
                        ₹{order.shippingPrice.toLocaleString("en-IN")}

                        Discount
                        ₹{order.discountAmount.toLocaleString("en-IN")}

                        Tax
                        ₹{order.taxPrice.toLocaleString("en-IN")}

                        Total
                        ₹{order.totalPrice.toLocaleString("en-IN")}

                    </div>


                    {/* Products */}

                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-4">
                            Products
                        </h2>

                        {(order.orderItems || order.items || []).map((item) => (

                            <div
                                key={item.product || item._id}
                                className="flex items-center gap-4 border border-white/10 rounded-xl p-4 mb-4"
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />

                                <div className="flex-1">

                                    <h3 className="font-semibold">
                                        {item.name}
                                    </h3>

                                    <p className="text-white/50 mt-1">
                                        Qty : {item.qty}
                                    </p>

                                    {item.size && (
                                        <p className="text-white/50">
                                            Size : {item.size}
                                        </p>
                                    )}

                                    {item.color && (
                                        <p className="text-white/50">
                                            Color : {item.color}
                                        </p>
                                    )}

                                </div>

                                <div className="text-right">

                                    <div className="font-bold text-lg">
                                        ₹{item.price}
                                    </div>

                                    <div className="text-white/50 text-sm">
                                        ₹{(item.price || 0) * (item.qty || 0)}
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Right */}

                <div className="space-y-6">

                    {/* Order Information */}

                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-5">
                            Order Information
                        </h2>

                        <div className="space-y-3">

                            <div className="flex justify-between">
                                <span className="text-white/50">Order No</span>
                                <span>{order.orderNumber}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/50">Status</span>

                                <span className="capitalize bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs">
                                    {order.status.replaceAll("_", " ")}
                                </span>
                            </div>

                            <div className="mt-5">

                                <label className="text-sm text-white/50 block mb-2">
                                    Update Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/50">Payment</span>

                                <span
                                    className={`${(order.paymentStatus || (order.isPaid ? "paid" : "pending")) === "paid"
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                        } capitalize`}
                                >
                                    {(order.paymentStatus || (order.isPaid ? "paid" : "pending")).replaceAll("_", " ")}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/50">Method</span>
                                <span className="uppercase">
                                    {order.paymentMethod}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/50">Ordered On</span>

                                <span>
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>

                        </div>
                        <button
                            onClick={updateOrderStatus}
                            className="mt-5 w-full bg-accent hover:bg-accent-dim rounded-lg py-2 font-semibold"
                        >
                            Save Status
                        </button>

                        <div className="flex justify-between">
                            <span className="text-white/50">Courier</span>
                            <span>{order.courier || "-"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-white/50">Tracking No.</span>
                            <span>{order.trackingNumber || "-"}</span>
                        </div>

                        <input
                            placeholder="Courier Name"
                            value={courier}
                            onChange={(event) => setCourier(event.target.value)}
                            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
                        />

                        <input
                            placeholder="Tracking Number"
                            value={trackingNumber}
                            onChange={(event) => setTrackingNumber(event.target.value)}
                            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
                        />

                    </div>

                    {/* Summary */}

                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-4">
                            Summary
                        </h2>

                        <div className="space-y-2">

                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>₹{order.itemsPrice}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>-₹{order.discountAmount}</span>
                            </div>

                            <hr className="border-white/10" />

                            <div className="flex justify-between font-bold text-lg">

                                <span>Total</span>

                                <span>
                                    ₹{order.totalPrice}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Tracking */}
                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-5">
                            Tracking
                        </h2>


                    </div>

                    <div className="bg-base-900 border border-white/10 rounded-xl p-6">

                        <h2 className="text-lg font-bold mb-4">
                            Actions
                        </h2>

                        <div className="grid gap-3">

                            <button
                                onClick={() => navigate(`/invoice/${order._id}`)}
                                className="bg-green-600 hover:bg-green-700 rounded-lg py-2"
                            >
                                Print Invoice
                            </button>

                            <a
                                href={`mailto:${order.user?.email}`}
                                className="rounded-lg bg-blue-600 py-2 text-center hover:bg-blue-700"
                            >
                                Send Email
                            </a>

                            <button
                                onClick={updateOrderStatus}
                                className="bg-yellow-600 hover:bg-yellow-700 rounded-lg py-2"
                            >
                                Update Tracking
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default OrderDetails;
