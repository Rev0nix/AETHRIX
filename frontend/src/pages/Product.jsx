import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [activeTab, setActiveTab] = useState("description");

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
        setSelectedBundle((relatedData || []).slice(0, 2));
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
    <div className="pb-20">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-6 text-sm text-white/40">

        <Link to="/" className="hover:text-white">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-white capitalize"
        >
          {product.category}
        </Link>

        <span className="mx-2">/</span>

        <span className="text-white">
          {product.name}
        </span>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex gap-4">

          {/* Thumbnails */}

          <div className="hidden md:flex flex-col gap-3">

            {product.images?.map((img, i) => (

              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg
                  ? "border-brand-gold"
                  : "border-white/10 hover:border-white/40"
                  }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>

            ))}

          </div>

          {/* Main Image */}

          <div className="flex-1">

            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#111111]">

              {product.images?.[activeImg]?.url ? (

                <img
                  src={product.images[activeImg].url}
                  alt={product.name}
                  onClick={() => setImageViewerOpen(true)}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-7xl text-white/10">
                  AX
                </div>

              )}

            </div>

            {/* Mobile Thumbnails */}

            <div className="md:hidden flex gap-3 mt-4 overflow-x-auto">

              {product.images?.map((img, i) => (

                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border ${i === activeImg
                    ? "border-brand-gold"
                    : "border-white/10"
                    }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>

              ))}

            </div>

          </div>

        </div>

        <div className="px-0 lg:px-10 pt-8 lg:pt-0">
          {product.badge && (
            <span className="text-[10px] tracking-[0.25em] uppercase border border-white/15 px-3 py-1 inline-block mb-5">
              {product.badge}
            </span>
          )}
          <h1 className="font-heading text-5xl font-bold text-white mb-3">{product.name}</h1>
          <div className="text-[11px] text-brand-gold tracking-widest uppercase mb-4">{product.category?.replace('-', ' ')}</div>

          <div className="text-4xl font-bold text-brand-gold mb-4">
            ₹{product.price.toLocaleString('en-IN')}
            {product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-white/30 line-through ml-3">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>

                <span className="ml-3 text-green-400 font-semibold">
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                    100
                  )}
                  % OFF
                </span>
              </>
            )}
            <div className="mt-4">

              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 text-green-400 px-4 py-2 text-sm">
                  ● In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 text-red-400 px-4 py-2 text-sm">
                  ● Out of Stock
                </span>
              )}

            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 text-brand-gold text-sm">
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
                <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] text-brand-gold underline">
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-7">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 text-xs border transition-colors ${size === s ? 'bg-white text-black border-white' : 'border-white/15 text-white/70 hover:border-white/40'
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

          <button
            onClick={() => {
              addToCart(product, qty);
              navigate("/checkout");
            }}
            className="btn-primary w-full mb-3"
          >
            Buy Now
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className={`w-full text-xs tracking-widest uppercase py-3 border transition-colors mb-7 ${wished ? 'border-brand-gold text-brand-gold' : 'border-white/15 text-white/50 hover:border-white/40'
              }`}
          >
            {wished ? '♥ Wishlisted' : '♡ Add to Wishlist'}
          </button>

          <div className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-white/45">
            <TbTruckDelivery className="text-brand-gold" /> Free delivery across India · Est. 3–5 days
          </div>
          <div className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-white/45">
            <TbRotate className="text-brand-gold" /> 7-day easy returns
          </div>
          <div className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-white/45">
            <TbShieldCheck className="text-brand-gold" /> 100% authentic, quality checked
          </div>
          <div className="flex items-start gap-3 py-3 text-sm text-white/45">
            <TbRuler className="text-brand-gold mt-0.5" /> {product.description}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-20">

        <div className="flex gap-8 border-b border-white/10 mb-8">

          {[
            "description",
            "specifications",
            "reviews",
            "shipping",
          ].map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 capitalize transition ${activeTab === tab
                ? "border-b-2 border-brand-gold text-white"
                : "text-white/40 hover:text-white"
                }`}
            >
              {tab}
            </button>

          ))}

        </div>

      </div>

      {activeTab === "description" && (

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="rounded-2xl bg-[#111111] border border-white/10 p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Product Description
            </h2>

            <p className="text-white/60 leading-8">
              {product.description}
            </p>

          </div>

        </div>

      )}

      {activeTab === "specifications" && (

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="rounded-2xl bg-[#111111] border border-white/10 overflow-hidden">

            <div className="grid grid-cols-2">

              <div className="p-5 border-b border-white/10">
                Brand
              </div>

              <div className="p-5 border-b border-white/10 text-white/60">
                AETHRIX
              </div>

              <div className="p-5 border-b border-white/10">
                Category
              </div>

              <div className="p-5 border-b border-white/10 text-white/60 capitalize">
                {product.category}
              </div>

              <div className="p-5">
                Stock
              </div>

              <div className="p-5 text-white/60">
                {product.stock}
              </div>

            </div>

          </div>

        </div>

      )}

      {activeTab === "shipping" && (

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="rounded-2xl bg-[#111111] border border-white/10 p-8 space-y-4">

            <p>🚚 Free Delivery Across India</p>

            <p>📦 Dispatch within 24 Hours</p>

            <p>↩ 7 Days Easy Returns</p>

            <p>🛡 Genuine Products Guaranteed</p>

          </div>

        </div>

      )}

      {/* Reviews */}
      {activeTab === "reviews" && (
        <div className="max-w-3xl mx-auto px-6 py-16 border-t border-white/5">
          <h2 className="font-display text-3xl tracking-wider mb-8">Reviews ({reviews.length})</h2>

          {isAuthenticated && (
            <form onSubmit={submitReview} className="mb-10 bg-base-900 border border-white/10 p-6">
              <div className="flex gap-1 mb-4 text-xl">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                    <TbStarFilled className={n <= reviewForm.rating ? 'text-brand-gold' : 'text-white/15'} />
                  </button>
                ))}
              </div>
              <input
                value={reviewForm.title}
                onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Review title"
                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm mb-3 outline-none focus:border-brand-gold"
              />
              <textarea
                required
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows={3}
                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm mb-3 outline-none focus:border-brand-gold resize-none"
              />
              <button type="submit" className="btn-primary text-[10px] px-6 py-2.5">
                Submit Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="flex flex-col gap-6">
              <div className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TbStarFilled
                      key={i}
                      className={i < Math.round(product.rating || 0)
                        ? "text-brand-gold"
                        : "text-white/15"}
                    />
                  ))}
                </div>

                <div className="font-semibold text-sm mb-1">
                  Amazon Customer Reviews
                </div>

                <p className="text-sm text-white/55 leading-relaxed">
                  Based on {product.numReviews || 0} customer reviews.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-white/5 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TbStarFilled
                        key={i}
                        className={`text-sm ${i < r.rating ? "text-brand-gold" : "text-white/15"
                          }`}
                      />
                    ))}
                  </div>

                  {r.title && (
                    <div className="font-semibold text-sm mb-1">
                      {r.title}
                    </div>
                  )}

                  <p className="text-sm text-white/55 leading-relaxed mb-2">
                    {r.comment}
                  </p>

                  <div className="text-xs text-white/30">
                    {r.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedBundle.length > 0 && (

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 border-t border-white/10">

          <h2 className="text-3xl font-bold mb-10">
            Frequently Bought Together
          </h2>

          <div className="grid lg:grid-cols-4 gap-8 items-center">

            <div className="flex items-center gap-6">

              <img
                src={product.images?.[0]?.url}
                className="w-28 h-28 object-cover rounded-xl"
              />

              <span className="text-4xl">+</span>

            </div>

            {selectedBundle.map((item) => (

              <div
                key={item._id}
                className="flex items-center gap-5"
              >

                <img
                  src={item.images?.[0]?.url}
                  className="w-28 h-28 rounded-xl object-cover"
                />

              </div>

            ))}

            <div>

              <h3 className="text-2xl font-bold mb-4">

                ₹
                {(
                  product.price +
                  selectedBundle.reduce(
                    (sum, p) => sum + p.price,
                    0
                  )
                ).toLocaleString("en-IN")}

              </h3>

              <button
                className="btn-primary w-full"
                onClick={() => {
                  addToCart(product, 1);

                  selectedBundle.forEach(item => {
                    addToCart(item, 1);
                  });
                }}
              >

                Add All To Cart

              </button>

            </div>

          </div>

        </div>

      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="px-6 lg:px-10 py-16 border-t border-white/5">
          <h2 className="font-display text-3xl tracking-wider mb-8 text-center">Recommended For You</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {imageViewerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">

          {/* Close */}
          <button
            onClick={() => setImageViewerOpen(false)}
            className="absolute top-6 right-8 text-4xl text-white hover:text-red-400"
          >
            ✕
          </button>

          {/* Previous */}
          {product.images.length > 1 && (
            <button
              onClick={() =>
                setActiveImg((prev) =>
                  prev === 0 ? product.images.length - 1 : prev - 1
                )
              }
              className="absolute left-6 text-5xl text-white hover:text-brand-gold"
            >
              ❮
            </button>
          )}

          {/* Image */}
          <img
            src={product.images[activeImg].url}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
          />

          {/* Next */}
          {product.images.length > 1 && (
            <button
              onClick={() =>
                setActiveImg((prev) =>
                  prev === product.images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-6 text-5xl text-white hover:text-brand-gold"
            >
              ❯
            </button>
          )}
        </div>
      )}


    </div>
  );
};

export default Product;
