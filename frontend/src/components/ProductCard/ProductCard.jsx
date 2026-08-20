import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const image =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image ||
    '';

  const rating = Number(product.rating || 0);
  const reviews = product.numReviews || product.reviewCount || 0;

  return (
    <div className="group h-full rounded-xl border border-white/10 bg-[#111] overflow-hidden transition-all duration-300 hover:border-brand-gold/60 hover:shadow-lg hover:shadow-brand-gold/5">

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative bg-white">

          <div className="aspect-square overflow-hidden">
            {!imageError && image ? (
              <img
                src={image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow hover:bg-white transition"
            aria-label="Add to wishlist"
          >
            ♡
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-3 sm:p-4">

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-white/50 mb-1 truncate">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm sm:text-base font-medium text-white leading-5 line-clamp-2 min-h-[40px] hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">

          <span className="text-sm font-semibold text-white">
            {rating.toFixed(1)}
          </span>

          <span className="text-brand-gold text-sm">
            ★
          </span>

          <span className="text-xs text-white/40">
            ({reviews})
          </span>

        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">

          <span className="text-xl sm:text-2xl font-bold text-brand-gold">
            ₹{Number(product.price || 0).toLocaleString('en-IN')}
          </span>

          {product.originalPrice &&
            Number(product.originalPrice) > Number(product.price) && (
              <span className="text-xs text-white/40 line-through">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}

        </div>

        {/* Stock */}
        <p className="text-xs text-green-400 mt-2">
          ● In Stock
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          className="
            w-full
            mt-3
            rounded-lg
            bg-brand-gold
            text-black
            py-2.5
            text-sm
            font-semibold
            hover:brightness-110
            active:scale-[0.98]
            transition
          "
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductCard;