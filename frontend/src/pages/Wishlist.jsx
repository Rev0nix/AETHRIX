import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        Loading Wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="eyebrow mb-2">
        ✦ Your Favorites
      </div>

      <h1 className="section-title mb-10">
        Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">
            Your wishlist is empty ❤️
          </h2>

          <Link to="/shop" className="btn-primary">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {wishlist.map((item) => (
            <div
              key={item.product._id}
              className="bg-[#111111] rounded-2xl border border-white/10 p-5"
            >
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-full h-60 object-cover rounded-xl"
              />

              <h2 className="text-xl font-semibold mt-5">
                {item.product.name}
              </h2>

              <p className="text-brand-gold text-2xl mt-3">
                ₹{item.product.price}
              </p>

              <div className="flex gap-3 mt-6">
                <Link
                  to={`/product/${item.product._id}`}
                  className="btn-primary"
                >
                  View
                </Link>

                <button
                  onClick={() => removeFromWishlist(item.product._id)}
                  className="btn-outline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Wishlist;