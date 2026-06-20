import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext(null);

const STORAGE_KEY = 'aethrix_wishlist';

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext) || {};
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync with backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/users/wishlist')
        .then((r) => setWishlist(r.data.data))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(
    async (product) => {
      const exists = wishlist.find((p) => p._id === product._id);
      if (exists) {
        setWishlist((prev) => prev.filter((p) => p._id !== product._id));
      } else {
        setWishlist((prev) => [...prev, product]);
      }
      if (isAuthenticated) {
        try {
          await api.post(`/users/wishlist/${product._id}`);
        } catch {
          /* best-effort sync */
        }
      }
    },
    [wishlist, isAuthenticated]
  );

  const isWishlisted = useCallback((productId) => wishlist.some((p) => p._id === productId), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
