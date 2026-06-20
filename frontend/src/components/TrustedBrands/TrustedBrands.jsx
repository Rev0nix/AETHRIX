import { trustedBrands } from '../../data/staticContent';

const TrustedBrands = () => {
  const doubled = [...trustedBrands, ...trustedBrands];
  return (
    <section className="py-16 border-y border-white/5 overflow-hidden">
      <div className="text-center mb-10">
        <div className="eyebrow">✦ Trusted By Fans Of</div>
      </div>
      <div className="flex gap-16 whitespace-nowrap animate-marquee w-max opacity-50">
        {doubled.map((brand, i) => (
          <span key={i} className="font-display text-3xl tracking-widest text-white/60">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TrustedBrands;
