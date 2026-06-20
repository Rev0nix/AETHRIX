import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/tb';
import { categories } from '../../data/staticContent';

const CategorySection = () => {
  return (
    <section className="section py-24 px-6 lg:px-10">
      <div className="text-center mb-16">
        <div className="eyebrow mb-4">✦ Shop By</div>
        <h2 className="section-title">Categories</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {categories.map((cat) => {
          const Icon = Icons[cat.icon] || Icons.TbCategory;
          return (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group bg-base-900 hover:bg-base-800 p-10 transition-colors flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center text-2xl text-accent-glow transition-colors">
                <Icon />
              </div>
              <div>
                <h3 className="font-display text-2xl tracking-wider mb-1">{cat.name}</h3>
                <p className="text-xs text-white/35">{cat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
