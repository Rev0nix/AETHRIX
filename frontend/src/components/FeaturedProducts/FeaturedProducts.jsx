import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import ProductCard from '../ProductCard/ProductCard';
import Loader from '../Loader/Loader';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getFeatured()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="text-center mb-16">
        <div className="eyebrow mb-4">✦ Hand-Picked</div>
        <h2 className="section-title">Featured Products</h2>
        <p className="text-sm text-white/35 mt-4">The pieces our customers can't stop talking about</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {products.map((p) => (
            <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedProducts;
