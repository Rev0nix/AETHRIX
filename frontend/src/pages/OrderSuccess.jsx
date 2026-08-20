import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center">

        <div className="text-7xl mb-6">🎉</div>

        <h1 className="text-5xl font-bold mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-white/60 mb-10">
          Thank you for shopping with AETHRIX.
          Your order has been confirmed.
        </p>

        <div className="flex gap-4 justify-center">

          <Link
            to="/orders"
            className="btn-primary"
          >
            View Orders
          </Link>

          <Link
            to="/shop"
            className="btn-outline"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;