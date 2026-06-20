import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { liveStats } from '../../data/staticContent';

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl text-accent-glow">
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

const LiveStats = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-base-900 via-base-800 to-base-900 border-y border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {liveStats.map((stat) => (
          <div key={stat.label}>
            <Counter value={stat.value} suffix={stat.suffix} />
            <div className="text-xs tracking-[0.2em] uppercase text-white/40 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveStats;
