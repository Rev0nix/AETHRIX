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
  const [total, setTotal] = useState(0);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const keyword = searchParams.get('keyword') || '';
  const subCategory = searchParams.get('subCategory') || '';
  const [limit, setLimit] = useState(12);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page: 1, limit };
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;
    if (sort) params.sort = sort;
    if (keyword) params.keyword = keyword;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    productService
      .getAll(params)
      .then((res) => {
        setProducts(res?.data || []);

        setTotal(res?.total || 0);
      })
      .catch((err) => {
        console.log(err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [category, subCategory, sort, keyword, limit, minPrice, maxPrice]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value !== '' && value !== null && value !== undefined) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setLimit(12);

    setSearchParams(next);
  };

  return (
    <div className="pt-10">
      <div className="px-6 lg:px-10 pb-8">
        <div className="eyebrow mb-2">
          {subCategory
            ? `${category} → ${subCategory}`
            : category
              ? category
              : keyword
                ? `Results for "${keyword}"`
                : 'All Products'}
        </div>
        <h1 className="section-title">Shop</h1>
      </div>

      <div className="flex flex-wrap gap-3 px-6 lg:px-10 pb-8 border-b border-white/5 items-center">


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

      <div className="px-6 lg:px-10 py-10 flex gap-8">
        <aside className="hidden lg:block w-72 shrink-0">

          <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="text-lg font-semibold mb-6">
              Filters
            </h2>

            <div className="space-y-4">

              <button
                onClick={() => updateParam("category", "")}
                className={`block w-full text-left px-3 py-2 rounded-lg ${!category
                  ? "bg-accent text-white"
                  : "hover:bg-white/10"
                  }`}
              >
                All Products
              </button>

              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => updateParam("category", c.slug)}
                  className={`block w-full text-left px-3 py-2 rounded-lg ${category === c.slug
                    ? "bg-accent text-white"
                    : "hover:bg-white/10"
                    }`}
                >
                  {c.name}
                </button>
              ))}

            </div>

          </div>

        </aside>

        <div className="flex-1"></div>


        {loading ? (
          <Loader />
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 text-white/35">
            <p className="text-sm">No products match your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-white/30 mb-6">{total} products found</p>
            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Showing {products.length} of {total} Products
                </h2>

                <p className="text-sm text-white/50 mt-1">
                  Explore premium collections curated for you.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <button className="w-10 h-10 rounded-lg border border-white/10 hover:border-accent transition">
                  ⬜
                </button>

                <button className="w-10 h-10 rounded-lg border border-white/10 hover:border-accent transition">
                  ☰
                </button>

              </div>

            </div>
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

            {products.length < total && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setLimit(prev => prev + 12)}
                  className="px-6 py-3 border border-white/15 hover:border-white/40"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
