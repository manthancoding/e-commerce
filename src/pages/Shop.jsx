import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const categories = ['All', 'Men', 'Women', 'Shoes', 'Accessories'];

    const filteredAndSortedProducts = useMemo(() => {
        return products
            .filter((product) => {
                const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
                const matchesRating = product.rating >= selectedRating;
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesRating && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === 'price-asc') return a.price - b.price;
                if (sortBy === 'price-desc') return b.price - a.price;
                return 0; // 'featured' keeps original order
            });
    }, [selectedCategory, selectedRating, sortBy, searchQuery]);

    return (
        <div className="bg-white min-h-screen pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                    </h1>
                    <p className="text-gray-500 max-w-2xl">
                        {searchQuery
                            ? `Found ${filteredAndSortedProducts.length} items matching your search.`
                            : 'Discover our complete collection of minimalist, timeless fashion pieces designed for everyday elegance.'}
                    </p>
                </div>

                {/* Toolbar (Filters & Sort) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-t border-b border-gray-100 mb-10 gap-4">

                    <div className="flex items-center">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center text-gray-700 hover:text-gray-900 font-medium md:hidden"
                        >
                            <SlidersHorizontal size={20} className="mr-2" />
                            Filters
                        </button>
                        <div className={`flex-col md:flex-row gap-4 md:flex ${isFilterOpen ? 'flex mt-4 md:mt-0' : 'hidden md:flex'}`}>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Rating Filter */}
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(Number(e.target.value))}
                                className="bg-gray-100 text-gray-700 text-sm font-medium rounded-full px-4 py-2 focus:outline-none appearance-none cursor-pointer pr-10 relative"
                            >
                                <option value={0}>All Ratings</option>
                                <option value={4.5}>4.5 ⭐️ & Above</option>
                                <option value={4.0}>4.0 ⭐️ & Above</option>
                                <option value={3.0}>3.0 ⭐️ & Above</option>
                            </select>

                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                        <span className="text-sm text-gray-500 mr-4 md:hidden">{filteredAndSortedProducts.length} items</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-gray-900 font-medium text-sm focus:outline-none appearance-none pr-8 cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setSelectedRating(0);
                                    setSearchParams({});
                                }}
                                className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                            {filteredAndSortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
