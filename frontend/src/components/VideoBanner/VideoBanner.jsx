import { Link } from 'react-router-dom';

// Note: Replace videoSrc with a real hosted MP4/WebM file (e.g. from Cloudinary or your CDN).
const VideoBanner = ({ videoSrc = '' }) => {
  return (
    <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
      {videoSrc ? (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-base-900 via-accent-dim/20 to-base-900" />
      )}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
      <div className="relative z-10 text-center px-6">
        <div className="eyebrow mb-4">✦ Behind The Brand</div>
        <h2 className="section-title mb-6">Crafted With Intent</h2>
        <Link to="/about" className="btn-outline">
          Watch Our Story
        </Link>
      </div>
    </section>
  );
};

export default VideoBanner;
