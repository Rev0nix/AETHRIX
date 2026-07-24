import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import ProductCard from '../ProductCard/ProductCard';
import Loader from '../Loader/Loader';
import { Link } from "react-router-dom";

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
        <div className="eyebrow mb-4">
          ✦ Premium Collection
        </div>

        <h2 className="section-title">
          Featured Products
        </h2>

        <p className="text-lg text-white/60 mt-5 max-w-2xl mx-auto leading-8">
          Discover our handpicked premium collection, carefully selected for exceptional quality, style, and value.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((p) => (
              <motion.div
                key={p._id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <Link to="/shop"
              className="inline-flex items-center px-8 py-3 border border-brand-gold text-brand-gold rounded-lg font-semibold hover:bg-brand-gold hover:text-black transition-all duration-300"
            >
              View All Products →
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
