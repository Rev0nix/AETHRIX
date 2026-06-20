import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import OrderTrackingTimeline from '../components/OrderTracking/OrderTrackingTimeline';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await orderService.track(orderNumber.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('order')) handleTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="eyebrow mb-4">✦ Order Status</div>
        <h1 className="section-title">Track Order</h1>
      </div>

      <form onSubmit={handleTrack} className="flex gap-3 mb-10">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter order number (e.g. AX-12345678)"
          className="flex-1 bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none focus:border-accent"
        />
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 text-sm mb-8">{error}</p>}

      {order && (
        <div className="bg-base-900 border border-white/10 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="font-display text-2xl tracking-wider">{order.orderNumber}</div>
              <div className="text-xs text-white/35 mt-1">Placed {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
            <div className="text-lg font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</div>
          </div>
          <OrderTrackingTimeline steps={order.trackingSteps} />
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
