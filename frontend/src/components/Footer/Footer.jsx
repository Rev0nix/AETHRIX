import { Link } from 'react-router-dom';
import {
  TbBrandInstagram,
  TbBrandX,
  TbBrandYoutube,
} from 'react-icons/tb';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-white/5 overflow-hidden">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-8">

        {/* ================= MAIN FOOTER ================= */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-[2fr_1fr_1fr_1fr]
          gap-10
          sm:gap-12
          mb-10
          sm:mb-12
        ">

          {/* Brand */}
          <div className="min-w-0">

            <div className="flex items-center gap-2 sm:gap-3 mb-5">
              <img
                src={logo}
                alt="AETHRIX Logo"
                className="h-10 sm:h-12 w-auto max-w-full"
              />

              <span className="
                font-heading
                text-lg
                sm:text-2xl
                tracking-[0.2em]
                sm:tracking-[0.25em]
                text-brand-gold
                font-bold
                whitespace-nowrap
              ">
                AETHRIX
              </span>
            </div>

            <p className="
              text-sm
              text-white/35
              leading-7
              mb-6
              max-w-md
            ">
              Luxury shopping for electronics, fashion, accessories,
              home essentials, and premium lifestyle products—all in one place.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">

              {[TbBrandInstagram, TbBrandX, TbBrandYoutube].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    aria-label="Social media"
                    className="
                      w-9
                      h-9
                      shrink-0
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-white/45
                      hover:text-white
                      hover:border-brand-gold
                      transition-colors
                    "
                  >
                    <Icon size={18} />
                  </a>
                )
              )}

            </div>
          </div>

          {/* Shop */}
          <FooterCol
            title="Shop"
            links={[
              { label: 'All Products', to: '/shop' },
              { label: 'New Arrivals', to: '/shop?sort=createdAt' },
              { label: 'Flash Sale', to: '/shop?badge=SALE' },
              { label: 'Bestsellers', to: '/shop?badge=BESTSELLER' },
            ]}
          />

          {/* Help */}
          <FooterCol
            title="Help"
            links={[
              { label: 'Track Order', to: '/track-order' },
              { label: 'Shipping Policy', to: '/contact' },
              { label: 'Returns', to: '/contact' },
              { label: 'Contact Us', to: '/contact' },
            ]}
          />

          {/* Brand */}
          <FooterCol
            title="Brand"
            links={[
              { label: 'About Us', to: '/about' },
              { label: 'My Account', to: '/profile' },
              { label: 'Admin Login', to: '/admin/login' },
            ]}
          />

        </div>


        {/* ================= COPYRIGHT ================= */}
        <div className="
          border-t
          border-white/5
          pt-6
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-2
          text-xs
          sm:text-sm
          text-white/25
        ">

          <span>
            © {new Date().getFullYear()} AETHRIX. All rights reserved.
          </span>

          <span>
            Luxury. Innovation. Trust.
          </span>

        </div>

      </div>
    </footer>
  );
};

const FooterCol = ({ title, links }) => (
  <div className="min-w-0">

    <h4 className="
      text-[10px]
      tracking-[0.25em]
      uppercase
      text-brand-gold
      font-bold
      mb-5
    ">
      {title}
    </h4>

    <ul className="flex flex-col gap-3">

      {links.map((link) => (
        <li key={link.label}>

          <Link
            to={link.to}
            className="
              inline-block
              text-sm
              text-white/50
              hover:text-brand-gold
              transition-all
              duration-300
              break-words
            "
          >
            {link.label}
          </Link>

        </li>
      ))}

    </ul>

  </div>
);

export default Footer;