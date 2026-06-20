import { Link } from 'react-router-dom';
import { TbMinus, TbPlus, TbShoppingBag } from 'react-icons/tb';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cart, removeFromCart, updateQty, itemsPrice, shippingPrice, totalPrice, discount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-32">
        <TbShoppingBag className="text-6xl mx-auto mb-6 text-white/15" />
        <h2 className="font-display text-3xl tracking-wider mb-3">Your bag is empty</h2>
        <Link to="/shop" className="btn-primary inline-block mt-4">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="eyebrow mb-2">✦ Review Your Order</div>
      <h1 className="section-title mb-10">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
        <div>
          {cart.map((item) => (
            <div key={item.key} className="flex gap-6 py-6 border-b border-white/10">
              <div className="w-[90px] h-[110px] bg-base-700 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium mb-1">{item.name}</div>
                {item.size && <div className="text-sm text-white/35 mb-3">Size: {item.size}</div>}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center border border-white/15">
                    <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10">
                      <TbMinus size={13} />
                    </button>
                    <span className="w-9 text-center font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10">
                      <TbPlus size={13} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.key)} className="text-xs text-white/30 hover:text-white/60 uppercase tracking-wider">
                  Remove
                </button>
              </div>
              <div className="font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div className="bg-base-900 border border-white/10 p-7 h-fit">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-bold mb-5">Order Summary</div>
          <Row label="Subtotal" value={`₹${itemsPrice.toLocaleString('en-IN')}`} />
          <Row label="Shipping" value={shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`} />
          {discount > 0 && <Row label="Discount" value={`−₹${discount.toLocaleString('en-IN')}`} />}
          <Row label="Total" value={`₹${totalPrice.toLocaleString('en-IN')}`} bold />
          <Link to="/checkout" className="btn-primary w-full block text-center mt-6">
            Checkout →
          </Link>
          <Link to="/shop" className="btn-outline w-full block text-center mt-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between py-2.5 ${bold ? 'border-t border-white/10 mt-2 pt-4 font-bold text-base' : 'text-sm text-white/55 border-b border-white/5'}`}>
    <span>{label}</span>
    <span className={bold ? 'text-white' : ''}>{value}</span>
  </div>
);

export default Cart;
