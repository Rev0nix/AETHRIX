import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // TODO: connect to newsletter service
    setSubmitted(true);
    setEmail('');

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="w-full overflow-hidden bg-white text-black py-14 sm:py-20 px-4 sm:px-6 text-center">

      <div className="w-full max-w-3xl mx-auto">

        {/* Eyebrow */}
        <div className="eyebrow !text-black/30 mb-4">
          ✦ Exclusive Access
        </div>

        {/* Heading */}
        <h2 className="
          section-title
          text-black
          text-4xl
          sm:text-5xl
          md:text-6xl
          leading-tight
        ">
          Join The Community
        </h2>

        {/* Description */}
        <p className="
          text-sm
          sm:text-base
          text-black/40
          mt-4
          mb-8
          sm:mb-10
          max-w-xl
          mx-auto
          leading-6
          sm:leading-7
          px-2
        ">
          Get early access to drops, flash sales, and insider updates.
        </p>

        {/* Newsletter form */}
        <form
          onSubmit={handleSubmit}
          className="
            w-full
            max-w-2xl
            mx-auto
            flex
            flex-col
            sm:flex-row
            gap-3
            sm:gap-0
          "
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="
              w-full
              min-w-0
              flex-1
              bg-white
              border
              border-black/15
              rounded-xl
              sm:rounded-r-none
              sm:rounded-l-xl
              px-4
              sm:px-5
              py-3.5
              text-sm
              sm:text-base
              outline-none
              placeholder:text-black/30
              focus:border-black/40
            "
          />

          <button
            type="submit"
            className="
              w-full
              sm:w-auto
              shrink-0
              bg-black
              text-white
              rounded-xl
              sm:rounded-l-none
              sm:rounded-r-xl
              px-6
              sm:px-7
              py-3.5
              text-[11px]
              font-bold
              tracking-[0.18em]
              uppercase
              hover:bg-zinc-800
              transition-colors
            "
          >
            {submitted ? 'Joined ✓' : 'Subscribe'}
          </button>
        </form>

      </div>
    </section>
  );
};

export default Newsletter;