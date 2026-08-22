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
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 xl:px-8 h-[68px] sm:h-[70px] flex items-center">

          {/* LEFT: Logo */}
          <div className="shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3"
            >
              <img
                src={logo}
                alt="AETHRIX Logo"
                className="
    h-8
    sm:h-10
    w-auto
    shrink-0
    rounded-3xl
  "
              />

              <span
                className="
          font-heading
          text-base
          sm:text-xl
          tracking-[0.22em]
          sm:tracking-[0.3em]
          text-brand-gold
          font-bold
          whitespace-nowrap
        "
              >
                AETHRIX
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <ul className="
    hidden
    xl:flex
    items-center
    justify-center
    gap-5
    2xl:gap-7
    flex-1
    min-w-0
    mx-6
    2xl:mx-10
    list-none
  ">

            {NAV_LINKS.map((link) => (
              <li key={link.to} className="shrink-0">
                <Link
                  to={link.to}
                  className="
            text-[11px]
            tracking-[0.16em]
            uppercase
            text-white/55
            hover:text-white
            transition-colors
            whitespace-nowrap
          "
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Categories */}
            <li
              className="relative shrink-0"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button
                type="button"
                className="
          text-[11px]
          tracking-[0.16em]
          uppercase
          text-white/70
          hover:text-brand-gold
          transition-all
          whitespace-nowrap
        "
              >
                Categories ▼
              </button>

              {showCategories && (
                <div className="
          absolute
          top-8
          left-1/2
          -translate-x-1/2
          bg-black
          border
          border-white/10
          rounded-xl
          p-6
          w-[760px]
          grid
          grid-cols-4
          gap-6
          z-[100]
        ">
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
                            className="
                      block
                      text-sm
                      text-white/60
                      hover:text-white
                      transition
                    "
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

          {/* RIGHT: Search + Actions */}
          <div className="flex items-center gap-1 sm:gap-1 shrink-0">


            {/* Search - desktop only */}
            <div className="hidden xl:block w-[280px] 2xl:w-[450px]">
              <SearchBar />
            </div>

            {/* Notification */}
            <button
              type="button"
              className="
        relative
        flex
        items-center
        justify-center
        w-9
        h-9
        text-white/75
        hover:text-white
        transition
        shrink-0
      "
              aria-label="Notifications"
            >
              <TbBell size={21} />

              <span className="
        absolute
        top-1
        right-1
        w-2
        h-2
        rounded-full
        bg-red-500
      " />
            </button>

            {/* Wishlist */}
            <Link
              to="/profile?tab=wishlist"
              className="
        relative
        flex
        items-center
        justify-center
        w-9
        h-9
        text-white/75
        hover:text-white
        transition
        shrink-0
      "
              aria-label="Wishlist"
            >
              <TbHeart size={21} />

              {wishlist.length > 0 && (
                <span className="
          absolute
          -top-0.5
          -right-0.5
          bg-brand-gold
          text-black
          text-[9px]
          w-4
          h-4
          rounded-full
          flex
          items-center
          justify-center
          font-bold
        ">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="
        relative
        flex
        items-center
        justify-center
        w-9
        h-9
        text-white/75
        hover:text-white
        transition
        shrink-0
      "
              aria-label="Shopping cart"
            >
              <TbShoppingBag size={21} />

              {itemCount > 0 && (
                <span className="
          absolute
          -top-0.5
          -right-0.5
          bg-brand-gold
          text-black
          text-[9px]
          w-4
          h-4
          rounded-full
          flex
          items-center
          justify-center
          font-bold
        ">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account - desktop */}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="
        hidden
        xl:flex
        items-center
        justify-center
        min-w-[58px]
        text-[10px]
        tracking-[0.15em]
        uppercase
        border
        border-white/15
        hover:border-brand-gold
        px-3
        py-2
        transition-colors
        whitespace-nowrap
      "
            >
              {isAuthenticated
                ? user?.name?.split(" ")[0]
                : "Sign In"}
            </Link>

            {/* Mobile / Tablet menu */}
            <button
              type="button"
              className="
        xl:hidden
        flex
        items-center
        justify-center
        w-9
        h-9
        text-white
        hover:text-brand-gold
        transition
        shrink-0
      "
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <TbMenu2 size={25} />
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
