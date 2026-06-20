import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TbStarFilled, TbTruckDelivery, TbRotate, TbShieldCheck, TbRuler } from 'react-icons/tb';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader/Loader';
import ProductCard from '../components/ProductCard/ProductCard';
import SizeGuide from '../components/SizeGuide/SizeGuide';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });

  useEffect(() => {
    setLoading(true);
    productService
      .getById(id)
      .then((data) => {
        setProduct(data);
        return Promise.all([productService.getRelated(data._id), productService.getReviews(data._id)]);
      })
      .then(([relatedData, reviewsData]) => {
        setRelated(relatedData || []);
        setReviews(reviewsData || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      const created = await productService.createReview(product._id, reviewForm);
      setReviews((r) => [created, ...r]);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      alert(err.message || 'Could not submit review');
    }
  };

  if (loading) return <Loader full />;
  if (!product) return <div className="text-center py-32 text-white/40">Product not found.</div>;

  const wished = isWishlisted(product._id);
  const fashionLike = ['fashion'].includes(product.category);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex flex-col gap-3">
          <div className="aspect-[4/5] bg-base-700 flex items-center justify-center overflow-hidden">
            {product.images?.[activeImg]?.url ? (
              <img src={product.images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-7xl text-white/10">AX</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 bg-base-700 border ${i === activeImg ? 'border-accent' : 'border-white/10'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-0 lg:px-10 pt-8 lg:pt-0">
          {product.badge && (
            <span className="text-[10px] tracking-[0.25em] uppercase border border-white/15 px-3 py-1 inline-block mb-5">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-4xl lg:text-5xl tracking-wide mb-2">{product.name}</h1>
          <div className="text-[11px] text-accent-glow tracking-widest uppercase mb-4">{product.category?.replace('-', ' ')}</div>

          <div className="text-2xl font-bold mb-2">
            ₹{product.price.toLocaleString('en-IN')}
            {product.compareAtPrice > product.price && (
              <span className="text-base text-white/30 line-through ml-3">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6 text-accent-glow text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <TbStarFilled key={i} className={i < Math.round(product.rating || 0) ? '' : 'opacity-20'} />
            ))}
            <span className="text-white/35">
              {product.rating || 0} · {product.numReviews || 0} reviews
            </span>
          </div>

          <hr className="border-white/5 my-6" />

          {fashionLike && (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">Select Size</span>
                <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] text-accent-glow underline">
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-7">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 text-xs border transition-colors ${
                      size === s ? 'bg-white text-black border-white' : 'border-white/15 text-white/70 hover:border-white/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Quantity</div>
          <div className="flex items-center border border-white/15 w-fit mb-7">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 text-xl hover:bg-white/10">−</button>
            <span className="w-14 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-11 h-11 text-xl hover:bg-white/10">+</button>
          </div>

          <button onClick={() => addToCart(product, qty, fashionLike ? size : null)} className="btn-primary w-full mb-3">
            Add to Bag
          </button>
          <Link to="/checkout" onClick={() => addToCart(product, qty, fashionLike ? size : null)} className="btn-outline w-full block text-center mb-3">
            Buy Now
          </Link>
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-full text-xs tracking-widest uppercase py-3 border transition-colors mb-7 ${
              wished ? 'border-accent text-accent-glow' : 'border-white/15 text-white/50 hover:border-white/40'
            }`}
          >
            {wished ? '♥ Wishlisted' : '♡ Add to Wishlist'}
          </button>

          <div className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-white/45">
            <TbTruckDelivery className="text-accent-glow" /> Free delivery across India · Est. 3–5 days
          </div>
          <div className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-white/45">
            <TbRotate className="text-accent-glow" /> 7-day easy returns
          </div>
          <div className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-white/45">
            <TbShieldCheck className="text-accent-glow" /> 100% authentic, quality checked
          </div>
          <div className="flex items-start gap-3 py-3 text-sm text-white/45">
            <TbRuler className="text-accent-glow mt-0.5" /> {product.description}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-3xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="font-display text-3xl tracking-wider mb-8">Reviews ({reviews.length})</h2>

        {isAuthenticated && (
          <form onSubmit={submitReview} className="mb-10 bg-base-900 border border-white/10 p-6">
            <div className="flex gap-1 mb-4 text-xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                  <TbStarFilled className={n <= reviewForm.rating ? 'text-accent-glow' : 'text-white/15'} />
                </button>
              ))}
            </div>
            <input
              value={reviewForm.title}
              onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Review title"
              className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm mb-3 outline-none focus:border-accent"
            />
            <textarea
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Share your experience..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm mb-3 outline-none focus:border-accent resize-none"
            />
            <button type="submit" className="btn-primary text-[10px] px-6 py-2.5">
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-white/30 text-sm">No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TbStarFilled key={i} className={`text-sm ${i < r.rating ? 'text-accent-glow' : 'text-white/15'}`} />
                  ))}
                  {r.verifiedPurchase && <span className="text-[10px] text-green-400/70 ml-2">Verified Purchase</span>}
                </div>
                {r.title && <div className="font-semibold text-sm mb-1">{r.title}</div>}
                <p className="text-sm text-white/55 leading-relaxed mb-2">{r.comment}</p>
                <div className="text-xs text-white/30">{r.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="px-6 lg:px-10 py-16 border-t border-white/5">
          <h2 className="font-display text-3xl tracking-wider mb-8 text-center">You May Also Like</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

export default Product;
