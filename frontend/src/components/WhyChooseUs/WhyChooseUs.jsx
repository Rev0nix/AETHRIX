import * as Icons from 'react-icons/tb';
import { whyChooseUs } from '../../data/staticContent';

const WhyChooseUs = () => {
  return (
    <section className="py-24 px-6 lg:px-10 bg-base-900/40 border-y border-white/5">
      <div className="text-center mb-16">
        <div className="eyebrow mb-4">✦ The Difference</div>
        <h2 className="section-title">Why Choose Us</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {whyChooseUs.map((item) => {
          const Icon = Icons[item.icon] || Icons.TbCheck;
          return (
            <div
              key={item.title}
              className="bg-base-900 hover:bg-base-800 transition-colors p-9 flex flex-col items-center text-center gap-3"
            >
              <Icon className="text-3xl text-accent-glow" />
              <h3 className="text-xs tracking-[0.2em] uppercase font-semibold">{item.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;
