import api from "./api";

export const wishlistService = {
  getWishlist: async () => {
    const { data } = await api.get("/wishlist");
    return data.data;
  },

  addToWishlist: async (productId) => {
    const { data } = await api.post("/wishlist", { productId });
    return data.data;
  },

  removeFromWishlist: async (productId) => {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return data.data;
  },
};