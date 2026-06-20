import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TbX, TbHeart } from 'react-icons/tb';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const WishlistDrawer = ({ open, onClose }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

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
              <span className="font-display text-2xl tracking-[0.2em]">WISHLIST</span>
              <button onClick={onClose} className="text-white/50 hover:text-white text-xl">
                <TbX />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {wishlist.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  <TbHeart className="text-5xl mx-auto mb-4 opacity-40" />
                  <p className="text-xs tracking-wider uppercase">Nothing wishlisted yet</p>
                </div>
              ) : (
                wishlist.map((p) => (
                  <div key={p._id} className="flex gap-4 py-4 border-b border-white/5 items-center">
                    <Link to={`/product/${p.slug}`} onClick={onClose} className="w-[60px] h-[75px] bg-base-700 flex-shrink-0 rounded" />
                    <div className="flex-1">
                      <Link to={`/product/${p.slug}`} onClick={onClose} className="text-xs uppercase tracking-wide block mb-1">
                        {p.name}
                      </Link>
                      <div className="text-sm font-bold">₹{p.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => addToCart(p)} className="text-[10px] bg-accent px-3 py-1.5 uppercase tracking-wider">
                        Add
                      </button>
                      <button onClick={() => toggleWishlist(p)} className="text-[10px] text-white/30 hover:text-white/60 uppercase tracking-wider">
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
