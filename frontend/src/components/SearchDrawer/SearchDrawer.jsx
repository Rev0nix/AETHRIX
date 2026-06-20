import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TbX, TbSearch } from 'react-icons/tb';
import { productService } from '../../services/productService';

const SearchDrawer = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      productService
        .searchSuggestions(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-[201] glass border-b border-white/10 p-8"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="eyebrow">Smart Search</span>
                <button onClick={onClose} className="text-white/60 hover:text-white text-xl">
                  <TbX />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="relative">
                <TbSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 text-xl" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full bg-transparent border-b border-white/20 focus:border-accent outline-none text-xl pl-9 py-3 transition-colors"
                />
              </form>

              {query.length >= 2 && (
                <div className="mt-6 max-h-80 overflow-y-auto">
                  {loading && <p className="text-white/40 text-sm">Searching...</p>}
                  {!loading && results.length === 0 && <p className="text-white/40 text-sm">No products found</p>}
                  {results.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        navigate(`/product/${p.slug}`);
                        onClose();
                      }}
                      className="flex items-center gap-4 w-full text-left py-3 border-b border-white/5 hover:bg-white/5 px-2 transition-colors"
                    >
                      <div className="w-12 h-14 bg-base-700 flex-shrink-0 rounded" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-white/40 capitalize">{p.category?.replace('-', ' ')}</div>
                      </div>
                      <div className="text-sm font-semibold">₹{p.price?.toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchDrawer;
