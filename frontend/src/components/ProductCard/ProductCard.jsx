import { useState } from "react";
import { Link } from "react-router-dom";
import { TbHeart, TbHeartFilled, TbStarFilled } from 'react-icons/tb';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wished = isWishlisted(product._id);

  return (
    <div className="group relative rounded-2xl bg-[#111827] border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)]">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-[#0f172a] overflow-hidden">
        {product.images?.length > 0 ? (
          <>
            <img
              src={product.images[0].url}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${product.images[1] ? "group-hover:opacity-0" : "group-hover:scale-105"
                }`}
            />

            {product.images[1] && (
              <img
                src={product.images[1].url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 font-display text-5xl">
            AX
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">

          {product.badge && (
            <span className="bg-accent text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}

          {product.compareAtPrice > product.price && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                100
              )}
              % OFF
            </span>
          )}

        </div>
      </Link>

      <button
        onClick={() => setQuickViewOpen(true)}
        className="absolute left-1/2 -translate-x-1/2 bottom-5
             opacity-0 group-hover:opacity-100
             transition-all duration-300
             bg-white text-black
             px-5 py-2
             rounded-full
             text-sm
             font-semibold"
      >
        Quick View
      </button>

      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${wished
          ? "bg-red-500 border-red-500 text-white"
          : "bg-black/40 border border-white/20 text-white hover:bg-white hover:text-black"
          }`}
      >
        {wished ? <TbHeartFilled /> : <TbHeart />}
      </button>

      <div className="p-5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-base font-semibold text-white line-clamp-2 min-h-[48px]">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 mb-3 text-yellow-400 text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <TbStarFilled key={i} className={i < Math.round(product.rating || 0) ? '' : 'opacity-20'} />
          ))}
          <span className="text-white/35 ml-1">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="mt-3 flex items-center gap-2 text-xs text-green-400">

            🚚

            <span>Free Delivery</span>

          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-white/30 line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3">

          {product.stock > 0 ? (
            <span className="text-green-400 text-xs">
              ● In Stock
            </span>
          ) : (
            <span className="text-red-400 text-xs">
              ● Out of Stock
            </span>
          )}

        </div>
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full mt-5 rounded-xl bg-accent hover:bg-accent/90 text-white py-3 font-semibold transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>

      {quickViewOpen && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">

          <div className="relative bg-[#111827] rounded-3xl max-w-5xl w-full p-8">

            <button
              onClick={() => setQuickViewOpen(false)}
              className="absolute top-5 right-5 text-2xl"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-10">

              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="rounded-2xl w-full"
              />

              <div>

                <h2 className="text-3xl font-bold mb-3">
                  {product.name}
                </h2>

                <p className="text-yellow-400 mb-3">
                  ⭐ {product.rating || 0}
                </p>

                <p className="text-4xl font-bold mb-6">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>

                <p className="text-white/70 leading-7">
                  {product.description}
                </p>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="mt-8 w-full rounded-xl bg-accent py-4 font-semibold"
                >
                  Add To Cart
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default ProductCard;
