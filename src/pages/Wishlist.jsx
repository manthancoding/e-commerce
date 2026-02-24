import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { HeartCrack } from 'lucide-react';

export const Wishlist = () => {
    const { wishlist } = useContext(WishlistContext);

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <HeartCrack size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Save items you love to your wishlist to easily find them later.
                </p>
                <Link
                    to="/shop"
                    className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">My Wishlist</h1>
                        <p className="text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};
