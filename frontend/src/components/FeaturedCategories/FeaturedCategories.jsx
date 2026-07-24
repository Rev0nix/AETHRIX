import { Link } from "react-router-dom";

const categories = [
    {
        name: "Electronics",
        image: "/categories/electronics.jpg",
        slug: "electronics",
    },
    {
        name: "Fashion",
        image: "/categories/fashion.jpg",
        slug: "fashion",
    },
    {
        name: "Watches",
        image: "/categories/watch.jpg",
        slug: "watches",
    },
    {
        name: "Shoes",
        image: "/categories/shoes.jpg",
        slug: "shoes",
    },
    {
        name: "Beauty",
        image: "/categories/beauty.jpg",
        slug: "beauty",
    },
    {
        name: "Gaming",
        image: "/categories/gaming.jpg",
        slug: "gaming",
    },
];

export default function FeaturedCategories() {
    return (
        <section className="py-20 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-14">
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            to={`/shop?category=${category.slug}`}
                            className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-white/10 hover:border-brand-gold hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">

                                <img
                                    src={category.image}
                        
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Dark gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                {/* Bottom title only */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <h3 className="text-white text-xl font-semibold text-center group-hover:text-brand-gold transition-colors">
                                        
                                    </h3>
                                </div>

                            </div>

                            <div className="p-4 text-center">
                                <h3 className="text-white font-semibold group-hover:text-brand-gold transition">
                                    {category.name}
                                </h3>
                            </div>

                        </Link>
                    ))}

                </div>

            </div>
        </section>
    );
}   