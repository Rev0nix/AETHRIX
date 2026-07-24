import { TbStarFilled } from "react-icons/tb";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    review:
      "Amazing quality and super fast delivery. The premium packaging made the experience even better.",
  },
  {
    name: "Priya Patel",
    rating: 5,
    review:
      "Excellent customer service and genuine products. Highly recommended!",
  },
  {
    name: "Arjun Kumar",
    rating: 5,
    review:
      "The website is smooth, products are premium, and delivery was on time.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <div className="eyebrow mb-3">
            ✦ Testimonials
          </div>

          <h2 className="section-title">
            What Our Customers Say
          </h2>

          <p className="text-white/60 mt-4">
            Trusted by thousands of happy customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-brand-gold transition"
            >
              <div className="flex gap-1 mb-5 text-brand-gold">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <TbStarFilled key={i} />
                ))}
              </div>

              <p className="text-white/70 leading-7">
                "{review.review}"
              </p>

              <h4 className="mt-6 font-semibold text-white">
                {review.name}
              </h4>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}