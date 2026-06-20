import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TbX, TbMinus, TbPlus, TbShoppingBag } from 'react-icons/tb';
import { useCart } from '../../hooks/useCart';

const CartDrawer = ({ open, onClose }) => {
  const { cart, removeFromCart, updateQty, itemsPrice } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[199]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-base-900 border-l border-white/10 z-[200] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="font-display text-2xl tracking-[0.2em]">YOUR BAG</span>
              <button onClick={onClose} className="text-white/50 hover:text-white text-xl">
                <TbX />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  <TbShoppingBag className="text-5xl mx-auto mb-4 opacity-40" />
                  <p className="text-xs tracking-wider uppercase">Your bag is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.key} className="flex gap-4 py-4 border-b border-white/5">
                    <div className="w-[72px] h-[90px] bg-base-700 flex-shrink-0 rounded" />
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide mb-1">{item.name}</div>
                      {item.size && <div className="text-xs text-white/35 mb-2">Size: {item.size}</div>}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-white/15">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:bg-white/10">
                            <TbMinus size={12} />
                          </button>
                          <span className="text-sm w-5 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:bg-white/10">
                            <TbPlus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                      <button onClick={() => removeFromCart(item.key)} className="text-[10px] uppercase tracking-wider text-white/30 hover:text-white/60 mt-2">
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <div className="flex justify-between text-sm font-bold mb-4">
                  <span>Subtotal</span>
                  <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <Link to="/checkout" onClick={onClose} className="btn-primary w-full block text-center">
                  Proceed to Checkout →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
