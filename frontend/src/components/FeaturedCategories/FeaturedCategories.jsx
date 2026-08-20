import { Link } from "react-router-dom";

const categories = [
    {
        name: "Electronics",
        image:
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85",
        slug: "electronics",
    },
    {
        name: "Fashion",
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85",
        slug: "fashion",
    },
    {
        name: "Watches",
        image:
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
        slug: "watches",
    },
    {
        name: "Shoes",
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
        slug: "shoes",
    },
    {
        name: "Beauty",
        image:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
        slug: "beauty",
    },
    {
        name: "Gaming",
        image:
            "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=85",
        slug: "gaming",
    },
];

export default function FeaturedCategories() {
    return (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-10 sm:mb-14">
                    <div className="eyebrow mb-3">
                        ✦ Categories
                    </div>

                    <h2 className="section-title">
                        Shop by Category
                    </h2>

                    <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                        Explore premium collections curated for every lifestyle.
                    </p>
                </div>

                {/* Categories */}
                <div className="
  grid
  grid-cols-2
  sm:grid-cols-3
  lg:grid-cols-6
  gap-3
  sm:gap-5
  lg:gap-6
">

                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            to={`/shop?category=${category.slug}`}
                            className="
                                group relative overflow-hidden rounded-2xl
                                bg-[#111111]
                                border border-white/10
                                hover:border-brand-gold
                                hover:-translate-y-2
                                transition-all duration-300
                            "
                        >

                            {/* Image */}
                            <div className="relative aspect-[4/5] sm:aspect-[4/5] overflow-hidden">

                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="
    w-full
    h-full
    object-cover
    transition-transform
    duration-500
    group-hover:scale-110
"
                                />

                                {/* Dark overlay */}
                                <div className="
                                    absolute inset-0
                                    bg-gradient-to-t
                                    from-black/80
                                    via-black/20
                                    to-transparent
                                " />

                            </div>

                        </Link>
                    ))}

                </div>

            </div>
        </section>
    );
}