import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

export const CategoryPage = () => {
    const { categoryName } = useParams();

    const categoryProducts = products.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );

    return (
        <div className="bg-white min-h-screen pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link to="/shop" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Shop
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight capitalize mb-4">
                        {categoryName}
                    </h1>
                    <p className="text-gray-500">
                        Explore our curated selection of {categoryName.toLowerCase()} fashion.
                    </p>
                </div>

                {categoryProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-900">No products found for this category.</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
