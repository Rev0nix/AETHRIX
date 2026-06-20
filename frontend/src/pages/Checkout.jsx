import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService, couponService } from '../services/orderService';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { cart, itemsPrice, shippingPrice, totalPrice, discount, couponCode, applyCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleApplyCoupon = async () => {
    try {
      const res = await couponService.validate(coupon, itemsPrice);
      applyCoupon(res.code, res.discount);
      setCouponMsg(`✓ ${res.code} applied — saved ₹${res.discount}`);
    } catch (err) {
      setCouponMsg(err.message || 'Invalid coupon');
    }
  };

  const buildShippingAddress = () => ({
    fullName: `${form.firstName} ${form.lastName}`.trim(),
    phone: form.phone,
    line1: form.address,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    country: 'India',
  });

  const buildItems = () =>
    cart.map((i) => ({ product: i.product, name: i.name, image: i.image, price: i.price, qty: i.qty, size: i.size, color: i.color }));

  const placeCodOrder = async () => {
    const order = await orderService.createOrder({
      items: buildItems(),
      shippingAddress: buildShippingAddress(),
      paymentMethod: 'cod',
      couponCode,
    });
    clearCart();
    navigate(`/orders?placed=${order.orderNumber}`);
  };

  const placeRazorpayOrder = async () => {
    const ok = await loadRazorpayScript();
    if (!ok) {
      alert('Razorpay SDK failed to load. Check your connection.');
      return;
    }

    const { data: rzpOrder, key } = await orderService.createRazorpayOrder(totalPrice);

    const options = {
      key,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      name: 'AETHRIX',
      description: 'Order Payment',
      order_id: rzpOrder.id,
      handler: async (response) => {
        try {
          const order = await orderService.createOrder({
            items: buildItems(),
            shippingAddress: buildShippingAddress(),
            paymentMethod: 'razorpay',
            couponCode,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          clearCart();
          navigate(`/orders?placed=${order.orderNumber}`);
        } catch (err) {
          alert(err.message || 'Order creation failed after payment');
        }
      },
      prefill: { name: `${form.firstName} ${form.lastName}`, email: form.email, contact: form.phone },
      theme: { color: '#3b82f6' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (paymentMethod === 'cod') await placeCodOrder();
      else await placeRazorpayOrder();
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return <div className="text-center py-32 text-white/40">Your cart is empty. <a href="/shop" className="text-accent-glow underline">Go shopping</a></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
      <form onSubmit={handlePay}>
        <div className="eyebrow mb-2">✦ Secure Checkout</div>
        <h1 className="font-display text-5xl tracking-wider mb-8">CHECKOUT</h1>

        <div className="text-[10px] tracking-[0.25em] uppercase text-accent-glow font-bold mb-5">Shipping Information</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
        <Input label="Address" name="address" value={form.address} onChange={handleChange} required />
        <div className="grid grid-cols-3 gap-4">
          <Input label="City" name="city" value={form.city} onChange={handleChange} required />
          <Input label="State" name="state" value={form.state} onChange={handleChange} required />
          <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
        </div>

        <div className="text-[10px] tracking-[0.25em] uppercase text-accent-glow font-bold mt-8 mb-4">Payment Method</div>
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('razorpay')}
            className={`flex-1 border p-4 text-left text-sm transition-colors ${paymentMethod === 'razorpay' ? 'border-accent bg-accent/10' : 'border-white/10'}`}
          >
            <div className="font-semibold">Razorpay</div>
            <div className="text-xs text-white/40">UPI · Cards · Net Banking · Wallets</div>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('cod')}
            className={`flex-1 border p-4 text-left text-sm transition-colors ${paymentMethod === 'cod' ? 'border-accent bg-accent/10' : 'border-white/10'}`}
          >
            <div className="font-semibold">Cash on Delivery</div>
            <div className="text-xs text-white/40">Pay when it arrives</div>
          </button>
        </div>

        <button type="submit" disabled={processing} className="btn-primary w-full disabled:opacity-50">
          {processing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order →' : 'Pay Now with Razorpay →'}
        </button>
      </form>

      <div className="bg-base-900 border border-white/10 p-7 h-fit sticky top-24">
        <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-bold mb-5">Order Summary</div>
        {cart.map((item) => (
          <div key={item.key} className="flex justify-between text-sm py-2 border-b border-white/5">
            <span className="text-white/55">
              {item.name} {item.size && `(${item.size})`} ×{item.qty}
            </span>
            <span className="font-semibold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
          </div>
        ))}

        <div className="flex mt-5 mb-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <button type="button" onClick={handleApplyCoupon} className="bg-white/10 hover:bg-white/15 px-4 text-xs uppercase tracking-wider">
            Apply
          </button>
        </div>
        {couponMsg && <p className="text-xs text-accent-glow mb-3">{couponMsg}</p>}

        <Row label="Subtotal" value={`₹${itemsPrice.toLocaleString('en-IN')}`} />
        <Row label="Shipping" value={shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`} />
        {discount > 0 && <Row label="Discount" value={`−₹${discount.toLocaleString('en-IN')}`} />}
        <Row label="Total" value={`₹${totalPrice.toLocaleString('en-IN')}`} bold />
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-2">{label}</label>
    <input {...props} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent" />
  </div>
);

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between py-2 ${bold ? 'border-t border-white/10 mt-2 pt-4 font-bold text-base' : 'text-sm text-white/55'}`}>
    <span>{label}</span>
    <span className={bold ? 'text-white' : ''}>{value}</span>
  </div>
);

export default Checkout;
