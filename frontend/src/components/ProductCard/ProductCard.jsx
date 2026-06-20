import { Link } from 'react-router-dom';
import { TbHeart, TbHeartFilled, TbStarFilled } from 'react-icons/tb';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wished = isWishlisted(product._id);

  return (
    <div className="group relative bg-base-800 border border-white/5 hover-lift overflow-hidden">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-base-700 overflow-hidden">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 font-display text-5xl">
            AX
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1">
            {product.badge}
          </span>
        )}
      </Link>

      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center border transition-colors ${
          wished ? 'bg-accent border-accent text-white' : 'bg-black/40 border-white/15 text-white/60 hover:text-white'
        }`}
      >
        {wished ? <TbHeartFilled /> : <TbHeart />}
      </button>

      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium tracking-wide mb-1 line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2 text-accent-glow text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <TbStarFilled key={i} className={i < Math.round(product.rating || 0) ? '' : 'opacity-20'} />
          ))}
          <span className="text-white/35 ml-1">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-white/30 line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full mt-3 bg-white/5 hover:bg-accent text-white text-[11px] font-semibold tracking-[0.15em] uppercase py-2.5 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
