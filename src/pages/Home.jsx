import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

export const Home = () => {
    // Get trending products (highest rated)
    const trendingProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    const categories = [
        { name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { name: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { name: "Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { name: "Accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-accent-light">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="text-accent uppercase tracking-[0.2em] font-semibold text-sm mb-4 block">
                        New Collection 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                        Elevate Your Everyday Style.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                        Discover our curated collection of minimalist fashion designed for the modern generation.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl group"
                    >
                        Shop Now
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
                        <p className="mt-2 text-gray-500">Explore our wide range of collections</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/category/${category.name}`}
                            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                <span className="text-white text-xl font-medium">{category.name}</span>
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending Products */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Trending Now</h2>
                            <p className="mt-2 text-gray-500">Our most popular fashion items this week</p>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center text-accent hover:text-gray-900 font-medium transition-colors">
                            View All <ArrowRight className="ml-1" size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {trendingProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-10 text-center md:hidden">
                        <Link to="/shop" className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Values */}
            <section className="py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">🌱</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainable Fashion</h3>
                        <p className="text-gray-500">Ethically crafted pieces made with sustainable materials to protect our planet.</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Quality</h3>
                        <p className="text-gray-500">We don't compromise on quality. Every piece is designed to last a lifetime.</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">📦</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Fast & Free Shipping</h3>
                        <p className="text-gray-500">Enjoy complimentary worldwide shipping on all orders over $150.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
