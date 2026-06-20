import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <div className="bg-base-900 py-24 px-6 text-center border-b border-white/5">
        <div className="eyebrow mb-4">✦ Our Story</div>
        <h1 className="section-title">About AETHRIX</h1>
        <p className="text-sm text-white/40 max-w-md mx-auto mt-5">Premium, multi-category, and built for people who expect more from every purchase.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="font-display text-4xl tracking-wider mb-6">The Vision</h2>
        <p className="text-white/45 leading-8 mb-8">
          AETHRIX started with a simple idea: premium shouldn't mean scattered across a dozen stores. Whether
          you're upgrading your tech, refreshing your wardrobe, decorating your space, or building a home gym —
          it should all live under one roof, with the same uncompromising quality bar.
        </p>
        <p className="text-white/45 leading-8 mb-12">
          Every product on AETHRIX is selected, tested, and quality-checked before it reaches our shelves. We
          partner directly with manufacturers to cut out markup, so you get genuine premium quality at honest prices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 mb-16">
          {['Inspire Confidence', 'Champion Individuality', 'Premium Always'].map((v, i) => (
            <div key={v} className="bg-base-900 p-9 text-center">
              <div className="font-display text-5xl text-white/10 mb-2">0{i + 1}</div>
              <div className="text-xs tracking-[0.15em] uppercase text-white/55">{v}</div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-4xl tracking-wider mb-6">Our Mission</h2>
        <p className="text-white/45 leading-8 mb-12">
          To build the most trusted multi-category storefront — one where every category meets the same standard,
          shipping is fast, support is real, and returns are never a fight.
        </p>

        <div className="text-center">
          <Link to="/shop" className="btn-primary">Explore the Collection</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
