import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbSearch, TbHeart, TbShoppingBag, TbMenu2, TbX } from 'react-icons/tb';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { productService } from '../../services/productService';
import SearchDrawer from '../SearchDrawer/SearchDrawer';

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
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-glow' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[70px] flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-white">
            AETHRIX
          </Link>

          <ul className="hidden lg:flex gap-9 list-none">
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
          </ul>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/65 hover:text-white transition-colors text-lg"
              title="Search"
            >
              <TbSearch />
            </button>
            <Link to="/profile?tab=wishlist" className="relative text-white/65 hover:text-white transition-colors text-lg">
              <TbHeart />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-white/65 hover:text-white transition-colors text-lg">
              <TbShoppingBag />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="hidden sm:block text-[11px] tracking-[0.15em] uppercase border border-white/15 hover:border-accent px-4 py-1.5 transition-colors"
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
                className="font-display text-3xl tracking-wider text-accent-glow"
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
