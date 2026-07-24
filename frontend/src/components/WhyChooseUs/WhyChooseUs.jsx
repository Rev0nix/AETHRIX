import {
  TbTruckDelivery,
  TbShieldLock,
  TbRefresh,
  TbAward,
} from "react-icons/tb";

const features = [
  {
    icon: TbTruckDelivery,
    title: "Free Shipping",
    description: "Fast and free delivery on eligible orders.",
  },
  {
    icon: TbShieldLock,
    title: "Secure Payments",
    description: "100% secure payment with trusted gateways.",
  },
  {
    icon: TbRefresh,
    title: "Easy Returns",
    description: "Simple 7-day return and replacement policy.",
  },
  {
    icon: TbAward,
    title: "Premium Quality",
    description: "Carefully selected products from trusted brands.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-6 lg:px-10 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <div className="eyebrow mb-3">✦ Why Choose Us</div>

          <h2 className="section-title">
            Why Shop With AETHRIX?
          </h2>

          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            We combine premium products with exceptional service to give you the best shopping experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center hover:border-brand-gold transition duration-300"
              >
                <Icon className="mx-auto text-5xl text-brand-gold mb-5" />

                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-white/60 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}