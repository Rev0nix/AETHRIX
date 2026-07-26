import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/orderService";




const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await orderService.getById(id);
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(search.toLowerCase())
    );


    const getStatusStyle = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-500/20 text-green-400";

            case "shipped":
                return "bg-blue-500/20 text-blue-400";

            case "packed":
                return "bg-yellow-500/20 text-yellow-400";

            case "confirmed":
                return "bg-cyan-500/20 text-cyan-400";

            case "pending":
                return "bg-gray-500/20 text-gray-400";

            case "cancelled":
                return "bg-red-500/20 text-red-400";

            default:
                return "bg-gray-500/20 text-gray-400";
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading Orders...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="eyebrow mb-2">
                ✦ Your Purchase History
            </div>

            <h1 className="section-title mb-8">
                My Orders
            </h1>

            <input
                type="text"
                placeholder="Search Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full lg:w-96 bg-[#111111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold mb-8"
            />

            <div className="space-y-6">

                {filteredOrders.map((order) => (

                    <div
                        key={order._id}
                        className="bg-[#111111] rounded-2xl border border-white/10 p-6"
                    >

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                            <div>

                                <h2 className="text-2xl font-semibold">
                                    Order #{order.orderNumber}
                                </h2>

                                <p className="text-white/50 mt-2">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </p>

                                <p className="text-white/50">
                                    {order.items.length} Items
                                </p>

                            </div>

                            <div className="mt-4 md:mt-0 text-right">

                                <span
                                    className={`px-4 py-2 rounded-full text-sm ${getStatusStyle(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>

                                <h3 className="text-brand-gold text-2xl font-bold mt-4">
                                    ₹{order.totalPrice.toLocaleString("en-IN")}
                                </h3>

                            </div>

                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">

                            <Link
                                to={`/orders/${order._id}`}
                                className="btn-primary"
                            >
                                View Details
                            </Link>

                            <button className="btn-outline">
                                Download Invoice
                            </button>

                            <button className="btn-outline">
                                Buy Again
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MyOrders;