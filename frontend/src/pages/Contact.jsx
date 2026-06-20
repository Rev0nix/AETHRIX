import { useState } from 'react';
import { TbBrandInstagram, TbMail, TbPhone } from 'react-icons/tb';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to POST /api/contact or an email service
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="py-20 px-6">
      <div className="text-center mb-16">
        <div className="eyebrow mb-4">✦ Get in Touch</div>
        <h1 className="section-title">Contact</h1>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
        <div className="bg-base-900 p-10">
          <h3 className="font-display text-3xl tracking-wider mb-3">Follow Us</h3>
          <p className="text-sm text-white/35 mb-5">We're most active on Instagram. Drop a DM and we'll reply within 24 hours.</p>
          <a href="#" className="inline-flex items-center gap-2 text-sm border-b border-white/20 hover:border-white pb-1 mb-10">
            <TbBrandInstagram /> @aethrix.store
          </a>

          <h3 className="font-display text-2xl tracking-wider mb-3">Email</h3>
          <p className="text-sm text-white/35 mb-5">For business enquiries and press.</p>
          <a href="mailto:hello@aethrix.in" className="inline-flex items-center gap-2 text-sm border-b border-white/20 hover:border-white pb-1 mb-10">
            <TbMail /> hello@aethrix.in
          </a>

          <h3 className="font-display text-2xl tracking-wider mb-3">Support Line</h3>
          <p className="inline-flex items-center gap-2 text-sm text-white/55">
            <TbPhone /> +91 1800-AETHRIX (Mon–Sat, 10am–6pm IST)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.015] p-10">
          <h3 className="font-display text-2xl tracking-wider mb-2">Send a Message</h3>
          <p className="text-sm text-white/35 mb-6">We'll respond within 48 hours.</p>

          <div className="mb-4">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="mb-5">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent resize-none"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            {sent ? 'Message Sent ✓' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
