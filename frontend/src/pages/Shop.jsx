import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard/ProductCard';
import Loader from '../components/Loader/Loader';
import { categories } from '../data/staticContent';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const keyword = searchParams.get('keyword') || '';
  const page = Number(searchParams.get('page')) || 1;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (keyword) params.keyword = keyword;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    productService
      .getAll(params)
      .then((res) => {
        setProducts(res.data);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort, keyword, page, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="pt-10">
      <div className="px-6 lg:px-10 pb-8">
        <div className="eyebrow mb-2">{keyword ? `Results for "${keyword}"` : 'All Products'}</div>
        <h1 className="section-title">Shop</h1>
      </div>

      <div className="flex flex-wrap gap-3 px-6 lg:px-10 pb-8 border-b border-white/5 items-center">
        <button
          onClick={() => updateParam('category', '')}
          className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
            !category ? 'bg-white text-black border-white' : 'border-white/15 text-white/55 hover:border-white/40'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => updateParam('category', c.slug)}
            className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
              category === c.slug ? 'bg-white text-black border-white' : 'border-white/15 text-white/55 hover:border-white/40'
            }`}
          >
            {c.name}
          </button>
        ))}

        <div className="ml-auto flex gap-3 items-center flex-wrap">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateParam('minPrice', minPrice)}
            className="w-24 bg-white/5 border border-white/10 text-xs px-3 py-2 outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateParam('maxPrice', maxPrice)}
            className="w-24 bg-white/5 border border-white/10 text-xs px-3 py-2 outline-none focus:border-accent"
          />
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-white/5 border border-white/10 text-xs px-3 py-2.5 outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-base-900">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-10">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/35">
            <p className="text-sm">No products match your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-white/30 mb-6">{total} products found</p>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {products.map((p) => (
                <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParam('page', p)}
                    className={`w-9 h-9 text-xs border transition-colors ${
                      p === page ? 'bg-accent border-accent' : 'border-white/15 text-white/50 hover:border-white/40'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
