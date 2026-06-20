import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbStarFilled, TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { testimonials } from '../../data/staticContent';

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[index];

  return (
    <section className="py-24 px-6 bg-[#060810]">
      <div className="text-center mb-14">
        <div className="eyebrow mb-4">✦ Community</div>
        <h2 className="section-title">Testimonials</h2>
      </div>

      <div className="max-w-xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="glass p-10 text-center"
          >
            <div className="flex justify-center gap-1 text-accent-glow mb-5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <TbStarFilled key={i} />
              ))}
            </div>
            <p className="font-serif italic text-lg text-white/75 leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-base-600 to-accent-dim flex items-center justify-center text-xs font-bold">
                {t.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-left">
                <div className="text-xs tracking-wider uppercase font-semibold">{t.name}</div>
                <div className="text-xs text-white/35">{t.location}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={prev} className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-2xl">
          <TbChevronLeft />
        </button>
        <button onClick={next} className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-2xl">
          <TbChevronRight />
        </button>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-white/15'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
