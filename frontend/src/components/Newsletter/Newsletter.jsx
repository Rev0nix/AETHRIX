import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to a real newsletter endpoint / ESP (Mailchimp, Klaviyo, etc.)
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="bg-white text-black py-20 px-6 text-center">
      <div className="eyebrow !text-black/30 mb-4">✦ Exclusive Access</div>
      <h2 className="section-title text-black">Join The Community</h2>
      <p className="text-sm text-black/40 mt-4 mb-10">Get early access to drops, flash sales, and insider updates.</p>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex border border-black/15">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-transparent px-5 py-3.5 text-sm outline-none placeholder:text-black/30"
        />
        <button type="submit" className="bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase px-7 hover:bg-base-700 transition-colors">
          {submitted ? 'Joined ✓' : 'Subscribe'}
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
