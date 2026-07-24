import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const Invoice = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        load();
    }, [id]);

    const load = async () => {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
    };

    if (!order) return <div>Loading...</div>;

    console.log(order);

    return (
        <div className="invoice-page bg-gray-100 min-h-screen p-10">

            <div className="invoice max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-10">

                {/* Header */}

                <div className="flex justify-between border-b pb-6">

                    <div>

                        <h1 className="text-4xl font-bold">
                            AETHRIX
                        </h1>

                        <p>Premium Fashion Store</p>

                        <p>Bangalore, Karnataka</p>

                        <p>aethrixofficial.in@gmail.com</p>

                        <p>+91 9686493855</p>

                    </div>

                    <div className="text-right">

                        <h2 className="text-3xl font-bold">
                            TAX INVOICE
                        </h2>

                        <p>
                            Invoice :
                            {order.orderNumber}
                        </p>

                        <p>
                            Date :
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                    </div>

                </div>

                {/* Customer */}

                <div className="grid grid-cols-2 gap-10 py-8">

                    <div>

                        <h3 className="font-bold mb-3">
                            BILL TO
                        </h3>

                        <p>{order.shippingAddress.fullName}</p>

                        <p>{order.user.email}</p>

                        <p>{order.shippingAddress.phone}</p>

                        <p>{order.shippingAddress.line1}</p>

                        {order.shippingAddress.line2 && (
                            <p>{order.shippingAddress.line2}</p>
                        )}

                        <p>
                            {order.shippingAddress.city},
                            {" "}
                            {order.shippingAddress.state}
                        </p>

                        <p>{order.shippingAddress.pincode}</p>

                    </div>

                    <div>

                        <h3 className="font-bold mb-3">
                            PAYMENT
                        </h3>

                        <p>
                            Method :
                            {order.paymentMethod}
                        </p>

                        <p>
                            Status :
                            {(order.paymentStatus || (order.isPaid ? "paid" : "pending")).replaceAll("_", " ")}
                        </p>

                        <p>
                            Order Status :
                            {order.status}
                        </p>

                    </div>

                </div>

                {/* Products */}

                <table className="w-full border">

                    <thead>

                        <tr className="bg-gray-200">

                            <th className="p-3 text-left">
                                Product
                            </th>

                            <th>
                                Qty
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Total
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {(order.items || []).map((item, index) => (
                            <tr key={item._id || item.product || index}>

                                <td className="p-3">

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={item.image}
                                            className="w-16 h-16 object-cover rounded"
                                        />

                                        <div>

                                            <p className="font-semibold">
                                                {item.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item.size}
                                                {" "}
                                                {item.color}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="text-center">
                                    {item.qty}
                                </td>

                                <td className="text-center">
                                    ₹{item.price}
                                </td>

                                <td className="text-center">
                                    ₹{item.qty * item.price}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {/* Totals */}

                <div className="flex justify-end mt-8">

                    <div className="w-80">

                        <div className="flex justify-between py-2">

                            <span>Items</span>

                            <span>
                                ₹{order.itemsPrice}
                            </span>

                        </div>

                        <div className="flex justify-between py-2">

                            <span>Shipping</span>

                            <span>
                                ₹{order.shippingPrice}
                            </span>

                        </div>

                        <div className="flex justify-between py-2">

                            <span>Discount</span>

                            <span>
                                -₹{order.discountAmount}
                            </span>

                        </div>

                        <hr />

                        <div className="flex justify-between py-3 text-xl font-bold">

                            <span>Total</span>

                            <span>
                                ₹{order.totalPrice}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="mt-16 border-t pt-8 text-center text-gray-500">

                    <p>
                        Thank you for shopping with AETHRIX.
                    </p>

                    <p>
                        This is a computer-generated invoice.
                    </p>

                </div>

                {/* Print Button */}

                <div className="mt-8 text-center no-print">

                    <button
                        onClick={() => window.print()}
                        className="bg-black text-white px-8 py-3 rounded-lg"
                    >
                        Print Invoice
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Invoice;
