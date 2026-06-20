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
      <div className="absolute w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating shapes */}
      <div className="absolute w-24 h-24 border border-accent/20 top-[18%] left-[7%] animate-floatY" />
      <div className="absolute w-14 h-14 border border-accent/20 top-[62%] left-[4%] animate-floatY [animation-delay:2.2s]" />
      <div className="absolute w-16 h-16 border border-accent/20 top-[22%] right-[7%] animate-floatY [animation-delay:1.1s]" />
      <div className="absolute w-10 h-10 border border-accent/20 bottom-[28%] right-[5%] animate-floatY [animation-delay:3.3s]" />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 text-center px-6"
      >
        <div className="eyebrow mb-6">✦</div>
        <h1 className="font-display text-[100px] md:text-[180px] leading-[0.88] tracking-[0.1em] bg-gradient-to-b from-white via-white to-white/25 bg-clip-text text-transparent">
          AETHRIX
        </h1>
        <p className="font-serif italic text-lg md:text-2xl text-white/50 tracking-wide mt-3 mb-5">
          Everything Premium, In One Place
        </p>
        <p className="text-sm text-white/35 max-w-md mx-auto leading-7 mb-12">
          ✦Curated for those who expect more✦
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/about" className="btn-outline">
            Our Story
          </Link>
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
