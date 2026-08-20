import { useContext } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";


const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  console.log(wishlist);
  const { addToCart } = useContext(CartContext);

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

          {wishlist.map((item, index) => {
            console.log("Item:", item);
            console.log("Images:", item.product.images);
            console.log("URL:", item.product.images?.[0]?.url);

            return (

              <div
                key={item._id || item.product?._id || index}
                className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-brand-gold transition-all"
              >


                <img
                  src={item.product.images?.[0]?.url || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-white line-clamp-2">
                    {item.product.name}
                  </h2>

                  <p className="text-brand-gold text-2xl font-bold mt-3">
                    ₹{item.product.price}
                  </p>

                  <div className="flex flex-col gap-3 mt-5">

                    <button
                      onClick={() => {
                        addToCart(item.product, 1);
                        removeFromWishlist(item.product._id);
                      }}
                      className="btn-primary w-full"
                    >
                      Move to Cart
                    </button>

                    <div className="flex gap-3">
                      <Link
                        to={`/product/${item.product.slug || item.product._id}`}
                        className="btn-outline flex-1 text-center"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => removeFromWishlist(item.product._id)}
                        className="btn-outline flex-1"
                      >
                        Remove
                      </button>
                    </div>

                  </div>

                </div>
              </div>

            );

          })}

        </div>
      )
      }

    </div >
  );
};

export default Wishlist;