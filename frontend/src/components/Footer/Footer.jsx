import { Link } from 'react-router-dom';
import { TbBrandInstagram, TbBrandX, TbBrandYoutube } from 'react-icons/tb';
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img
              src={logo}
              alt="AETHRIX Logo"
              className="h-12 w-auto"
            />

            <span className="font-heading text-2xl tracking-[0.25em] text-brand-gold font-bold">
              AETHRIX
            </span>
          </div>
          <p className="text-sm text-white/35 leading-relaxed mb-6 max-w-xs">
            Luxury shopping for electronics, fashion, accessories, home essentials, and premium lifestyle products—all in one place.
          </p>
          <div className="flex gap-3">
            {[TbBrandInstagram, TbBrandX, TbBrandYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/45 hover:text-white hover:border-brand-gold transition-colors"
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
        <span>Designed with passion. Delivered with excellence.</span>
      </div>
      <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-6 lg:px-10">

        {/* Main Footer */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          ...
        </div>

        {/* 👇 ADD NEWSLETTER HERE */}
        <div className="max-w-7xl mx-auto border-t border-white/10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <h3 className="text-2xl font-heading text-brand-gold">
              Join AETHRIX
            </h3>

            <p className="text-white/50 mt-2">
              Subscribe for exclusive offers and new arrivals.
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg bg-black border border-white/10 text-white outline-none flex-1 md:w-80"
            />

            <button
              className="px-6 py-3 bg-brand-gold text-black rounded-lg font-semibold hover:brightness-95 transition"
            >
              Subscribe
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-wrap justify-between gap-3 text-xs text-white/25">
          <span>© {new Date().getFullYear()} AETHRIX. All rights reserved.</span>
          <span>Luxury. Innovation. Trust.</span>
        </div>

      </footer>
    </footer>

  );
};

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-[10px] tracking-[0.25em] uppercase text-brand-gold font-bold mb-5">{title}</h4>
    <ul className="flex flex-col gap-3">
      {links.map((l) => (
        <li key={l.label}>
          <Link to={l.to} className="text-sm text-white/50 hover:text-brand-gold transition-all duration-300">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
