import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05070d] via-[#0a0e1a] to-[#05070d]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 64px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 64px)',
        }}
      />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating shapes */}
      <div className="absolute w-24 h-24 border border-brand-gold/20 top-[18%] left-[7%] animate-floatY" />
      <div className="absolute w-14 h-14 border border-brand-gold/20 top-[62%] left-[4%] animate-floatY [animation-delay:2.2s]" />
      <div className="absolute w-16 h-16 border border-brand-gold/20 top-[22%] right-[7%] animate-floatY [animation-delay:1.1s]" />
      <div className="absolute w-10 h-10 border border-brand-gold/20 bottom-[28%] right-[5%] animate-floatY [animation-delay:3.3s]" />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 text-center px-6"
      >
        <div className="eyebrow mb-6">✦</div>
        <h1 className="font-heading text-[100px] md:text-[180px] leading-[0.88] tracking-[0.1em] bg-gradient-to-b from-white via-white to-white/25 bg-clip-text text-transparent">
          AETHRIX
        </h1>
        <p className="font-body italic text-lg md:text-2xl text-white/50 tracking-wide mt-3 mb-5">
          Luxury Redefined
        </p>
        <p className="text-sm text-white/35 max-w-md mx-auto leading-7 mb-12">
          ✦Curated for those who expect more✦
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/about" className="btn-outline">
            Explore Collection
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/60 text-sm">

          <div className="flex items-center gap-2">
            🚚
            <span>Free Shipping</span>
          </div>

          <div className="flex items-center gap-2">
            🔄
            <span>7 Days Return</span>
          </div>

          <div className="flex items-center gap-2">
            🔒
            <span>Secure Payment</span>
          </div>

          <div className="flex items-center gap-2">
            ⭐
            <span>25K+ Happy Customers</span>
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-2">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
              alt="iPhone"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <p className="text-white/50 text-sm">
              Apple
            </p>

            <h3 className="text-white text-xl font-semibold mt-2">
              iPhone 16 Pro
            </h3>

            <p className="text-brand-gold font-bold mt-3">
              ₹1,19,999
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-2">
            <img
              src="https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500"
              alt="MacBook"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <p className="text-white/50 text-sm">
              Apple
            </p>

            <h3 className="text-white text-xl font-semibold mt-2">
              MacBook Air M4
            </h3>

            <p className="text-brand-gold font-bold mt-3">
              ₹1,39,999
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-2">
            <img
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500"
              alt="PlayStation"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <p className="text-white/50 text-sm">
              Sony
            </p>

            <h3 className="text-white text-xl font-semibold mt-2">
              PlayStation 5
            </h3>

            <p className="text-brand-gold font-bold mt-3">
              ₹54,999
            </p>
          </div>

        </div>

      </motion.div>

      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-[10px] tracking-[0.25em] uppercase">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30" />
        Scroll
      </div>
    </section>
  );
};

export default Hero;
