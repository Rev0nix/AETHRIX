import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');

        // Support common backend response formats
        const productData =
          response.data?.data ||
          response.data?.products ||
          response.data ||
          [];

        // Make sure we always work with an array
        const productList = Array.isArray(productData)
          ? productData
          : [];

        // Show only the first 3 products
        setProducts(productList.slice(0, 3));
      } catch (error) {
        console.error('Failed to load homepage products:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductImage = (product) => {
    if (product.image) return product.image;
    if (product.imageUrl) return product.imageUrl;
    if (product.productUrl) return product.productUrl;

    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      if (typeof firstImage === 'string') {
        return firstImage;
      }

      return firstImage?.url || firstImage?.src || '';
    }

    return '';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">

      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05070d] via-[#0a0e1a] to-[#05070d]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 64px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 64px)',
        }}
      />

      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating shapes */}
      <div className="absolute w-24 h-24 border border-brand-gold/20 top-[18%] left-[7%] animate-floatY" />

      <div className="absolute w-14 h-14 border border-brand-gold/20 top-[62%] left-[4%] animate-floatY [animation-delay:2.2s]" />

      <div className="absolute w-16 h-16 border border-brand-gold/20 top-[22%] right-[7%] animate-floatY [animation-delay:1.1s]" />

      <div className="absolute w-10 h-10 border border-brand-gold/20 bottom-[28%] right-[5%] animate-floatY [animation-delay:3.3s]" />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full text-center px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-16"
      >

        <div className="eyebrow mb-6">✦</div>

        <h1 className="font-heading text-[58px] sm:text-[76px] md:text-[120px] lg:text-[150px] leading-[0.8] tracking-[0.04em] md:tracking-[0.01em] bg-gradient-to-b from-white via-white to-white/25 bg-clip-text text-transparent whitespace-nowrap">
          AETHRIX
        </h1>

        <p className="font-body italic text-base sm:text-lg md:text-2xl text-white/50 tracking-wide mt-4 mb-4">
          Luxury Redefined
        </p>

        <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto leading-6 sm:leading-7 mb-8 sm:mb-10 px-4">
          ✦Curated for those who expect more✦
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <Link
            to="/shop"
            className="btn-primary w-full sm:w-auto min-w-[220px] text-center"
          >
            Shop Now
          </Link>

          <Link
            to="/about"
            className="btn-outline w-full sm:w-auto min-w-[220px] text-center"
          >
            Explore Collection
          </Link>
        </div>

        {/* Features */}
        <div className="mt-9 sm:mt-10 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-x-6 gap-y-5 sm:gap-8 text-white/60 text-xs sm:text-sm max-w-md sm:max-w-none mx-auto">

          <div className="flex items-center justify-center gap-2">
            🚚
            <span>Free Shipping</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            🔄
            <span>7 Days Return</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            🔒
            <span>Secure Payment</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            ⭐
            <span>25K+ Happy Customers</span>
          </div>

        </div>

        {/* ============================= */}
        {/* DYNAMIC PRODUCTS */}
        {/* ============================= */}

        <div className="
  mt-12
  sm:mt-16
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  gap-4
  sm:gap-6
  max-w-5xl
  mx-auto
  w-full
">

          {loadingProducts ? (

            // Loading state
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 animate-pulse"
              >
                <div className="
  w-full
  h-44
  sm:h-48
  object-cover
  rounded-xl
  mb-4
" />

                <div className="h-4 w-20 bg-white/10 rounded mb-3 mx-auto" />

                <div className="h-6 w-40 bg-white/10 rounded mb-3 mx-auto" />

                <div className="h-5 w-24 bg-white/10 rounded mx-auto" />
              </div>
            ))

          ) : products.length === 0 ? (

            // No products
            <div className="md:col-span-3 text-center text-white/40 py-10">
              <p>No products available.</p>

              <Link
                to="/shop"
                className="inline-block mt-4 btn-outline"
              >
                Browse Shop
              </Link>
            </div>

          ) : (

            // Actual products
            products.map((product) => {

              const image = getProductImage(product);

              return (
                <Link
                  key={product._id}
                  to={`/product/${product.slug || product._id}`}
                  className="group"
                >

                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-2">

                    {/* Product image */}
                    <div className="w-full h-48 rounded-xl mb-4 overflow-hidden bg-white/5 flex items-center justify-center">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name || 'Product'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-white/20 text-sm">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* Brand */}
                    <p className="text-white/50 text-sm">
                      {product.brand || 'AETHRIX'}
                    </p>

                    {/* Product name */}
                    <h3 className="text-white text-xl font-semibold mt-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-brand-gold font-bold mt-3">
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </p>

                  </div>

                </Link>
              );
            })

          )}

        </div>

      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-[10px] tracking-[0.25em] uppercase">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30" />
        Scroll
      </div>

    </section>
  );
};

export default Hero;