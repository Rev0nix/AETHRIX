import { Link } from 'react-router-dom';
import { TbBrandInstagram, TbBrandX, TbBrandYoutube } from 'react-icons/tb';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <div className="font-display text-3xl tracking-[0.25em] mb-4">AETHRIX</div>
          <p className="text-sm text-white/35 leading-relaxed mb-6 max-w-xs">
            Premium multi-category store — electronics, fashion, smart gadgets, home decor, fitness & accessories.
          </p>
          <div className="flex gap-3">
            {[TbBrandInstagram, TbBrandX, TbBrandYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/45 hover:text-white hover:border-accent transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { label: 'All Products', to: '/shop' },
            { label: 'New Arrivals', to: '/shop?sort=createdAt' },
            { label: 'Flash Sale', to: '/shop?badge=SALE' },
            { label: 'Bestsellers', to: '/shop?badge=BESTSELLER' },
          ]}
        />
        <FooterCol
          title="Help"
          links={[
            { label: 'Track Order', to: '/track-order' },
            { label: 'Shipping Policy', to: '/contact' },
            { label: 'Returns', to: '/contact' },
            { label: 'Contact Us', to: '/contact' },
          ]}
        />
        <FooterCol
          title="Brand"
          links={[
            { label: 'About Us', to: '/about' },
            { label: 'My Account', to: '/profile' },
            { label: 'Admin Login', to: '/admin/login' },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-wrap justify-between gap-3 text-xs text-white/25">
        <span>© {new Date().getFullYear()} AETHRIX. All rights reserved.</span>
        <span>Made with intent. Worn with purpose.</span>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-bold mb-5">{title}</h4>
    <ul className="flex flex-col gap-3">
      {links.map((l) => (
        <li key={l.label}>
          <Link to={l.to} className="text-sm text-white/35 hover:text-white transition-colors">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
