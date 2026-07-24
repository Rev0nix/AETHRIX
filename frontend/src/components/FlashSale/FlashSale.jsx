import { Link } from "react-router-dom";
import { TbBolt } from "react-icons/tb";

export default function FlashSale() {
  return (
    <section className="py-20 px-6 lg:px-10 bg-[#111111]">
      <div className="max-w-7xl mx-auto rounded-3xl border border-brand-gold/20 bg-black p-10">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          <div>
            <div className="flex items-center gap-2 text-brand-gold mb-3">
              <TbBolt size={28} />
              <span className="font-semibold uppercase tracking-widest">
                Flash Sale
              </span>
            </div>

            <h2 className="text-4xl font-heading font-bold text-white">
              Up to 50% OFF
            </h2>

            <p className="text-white/60 mt-4 max-w-lg">
              Limited-time offers on premium electronics, fashion,
              accessories, and more.
            </p>
          </div>

          <Link
            to="/shop?badge=SALE"
            className="px-8 py-4 rounded-xl bg-brand-gold text-black font-semibold hover:brightness-95 transition"
          >
            Shop Deals
          </Link>

        </div>

      </div>
    </section>
  );
}