import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

import {
  TbHeart,
  TbShoppingBag,
  TbMenu2,
  TbX,
  TbBell,
  TbMapPin,
} from "react-icons/tb";

import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";

import SearchBar from "../SearchBar";
import SearchDrawer from "../SearchDrawer/SearchDrawer";

import { categories } from "../../data/staticContent";

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/track-order', label: 'Track Order' },
];

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[70px] flex items-center">
          <div className="flex items-center gap-14">

            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="AETHRIX Logo"
                className="h-10 w-auto"
              />

              <span className="font-heading text-xl tracking-[0.35em] text-brand-gold font-bold">
                AETHRIX
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-1 text-white">
              <TbMapPin size={20} />

            </div>

          </div>

          <ul className="hidden lg:flex ml-8 gap-7 list-none items-center">

            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-xs tracking-[0.2em] uppercase text-white/55 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-brand-gold transition-all duration-300">
                Categories ▼
              </button>

              {showCategories && (
                <div className="absolute top-8 left-0 bg-black border border-white/10 rounded-xl p-6 w-[800px] grid grid-cols-4 gap-6 z-50">

                  {categories.map((cat) => (
                    <div key={cat.slug}>
                      <h3 className="font-bold text-white mb-3">
                        {cat.name}
                      </h3>

                      <div className="space-y-2">
                        {cat.subCategories?.map((sub) => (
                          <Link
                            key={sub}
                            to={`/shop?category=${cat.slug}&subCategory=${encodeURIComponent(sub)}`}
                            className="block text-sm text-white/60 hover:text-white"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>

                    </div>
                  ))}

                </div>
              )}
            </li>

          </ul>

          <div className="flex items-center gap-8 ml-12">

            <SearchBar />

            <div className="relative cursor-pointer text-white/70 hover:text-white transition">
              <TbBell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </div>

            <Link to="/wishlist" className="relative text-white/65 hover:text-white transition-colors text-lg">
              <TbHeart />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-white/65 hover:text-white transition-colors text-lg">
              <TbShoppingBag />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="hidden sm:block text-[11px] tracking-[0.15em] uppercase border border-white/15 hover:border-brand-gold px-4 py-1.5 transition-colors"
            >
              {isAuthenticated ? user?.name?.split(' ')[0] : 'Sign In'}
            </Link>

            <button className="lg:hidden text-white text-xl" onClick={() => setMobileOpen(true)}>
              <TbMenu2 />
            </button>

          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-base-900 flex flex-col p-8"
          >
            <button className="self-end text-white text-2xl mb-10" onClick={() => setMobileOpen(false)}>
              <TbX />
            </button>
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl tracking-wider text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl tracking-wider text-brand-gold"
              >
                {isAuthenticated ? 'My Account' : 'Sign In'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
