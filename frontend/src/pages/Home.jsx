import Hero from '../components/Hero/Hero';
import Marquee from '../components/Marquee/Marquee';
import TrustedBrands from '../components/TrustedBrands/TrustedBrands';
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts';
import CategorySection from '../components/CategorySection/CategorySection';
import FlashSale from '../components/FlashSale/FlashSale';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import LiveStats from '../components/LiveStats/LiveStats';
import VideoBanner from '../components/VideoBanner/VideoBanner';
import Testimonials from '../components/Testimonials/Testimonials';
import Newsletter from '../components/Newsletter/Newsletter';

const Home = () => {
  return (
    <div>
      <Hero />
      <Marquee />
      <TrustedBrands />
      <FeaturedProducts />
      <CategorySection />
      <FlashSale />
      <WhyChooseUs />
      <LiveStats />
      <VideoBanner />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
