import { createContext, useContext, useEffect, useState } from "react";
import { wishlistService } from "../services/wishlistService";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();

      console.log("Wishlist API:", data);
      console.log("Wishlist Items:", data.items);
      console.log("First Product:", data.items?.[0]?.product);

      setWishlist(data.items || []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const addToWishlist = async (productId) => {
    await wishlistService.addToWishlist(productId);
    await loadWishlist();
  };

  const removeFromWishlist = async (productId) => {
    await wishlistService.removeFromWishlist(productId);
    await loadWishlist();
  };

  // Check whether a product is already in the wishlist
  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) =>
        item.product?._id === productId ||
        item.product === productId
    );
  };

  // Toggle wishlist state
  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isWishlisted(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        reloadWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);