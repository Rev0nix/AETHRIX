import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCountdown } from '../../hooks/useCountdown';
import { productService } from '../../services/productService';
import ProductCard from '../ProductCard/ProductCard';

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="glass w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-display text-3xl md:text-4xl text-accent-glow">
      {String(value).padStart(2, '0')}
    </div>
    <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">{label}</span>
  </div>
);

const FlashSale = () => {
  // Defaults to 5 days from now if not driven by backend data
  const [endsAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    d.setHours(d.getHours() + 22);
    return d;
  });
  const { days, hours, minutes, seconds, expired } = useCountdown(endsAt);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService
      .getFlashSale()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  if (expired) return null;

  return (
    <section className="py-24 px-6 lg:px-10 bg-gradient-to-b from-accent/10 via-transparent to-transparent">
      <div className="text-center mb-10">
        <div className="eyebrow mb-4">⚡ Limited Time</div>
        <h2 className="section-title">Flash Sale</h2>
        <div className="flex justify-center gap-4 mt-8">
          <TimeBox value={days} label="Days" />
          <TimeBox value={hours} label="Hours" />
          <TimeBox value={minutes} label="Min" />
          <TimeBox value={seconds} label="Sec" />
        </div>
      </div>

      {products.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 mt-12"
        >
          {products.map((p) => (
            <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="text-center mt-10">
        <Link to="/shop" className="btn-primary">
          Shop All Deals
        </Link>
      </div>
    </section>
  );
};

export default FlashSale;
