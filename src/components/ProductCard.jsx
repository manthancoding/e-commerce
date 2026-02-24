import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

export const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const isWishlisted = isInWishlist(product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Defaulting to "M" size for quick add from card
        addToCart(product, "M");
    };

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="group block">
            <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-accent transition-colors shadow-sm z-10"
                >
                    <Heart
                        size={18}
                        className={isWishlisted ? "fill-accent text-accent" : ""}
                    />
                </button>

                {/* Quick Add Button (Visible on Hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-white/90 backdrop-blur-md text-gray-900 py-3 rounded-xl font-medium shadow-lg hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        Quick Add +
                    </button>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate pr-4">
                        {product.name}
                    </h3>
                    <span className="text-sm font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="mr-2">{product.category}</span>
                    <span className="flex items-center">
                        <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
                        {product.rating}
                    </span>
                </div>
            </div>
        </Link>
    );
};
