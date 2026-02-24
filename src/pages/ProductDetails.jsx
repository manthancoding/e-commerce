import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Heart, Star, ArrowLeft, Truck, RotateCcw } from 'lucide-react';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === parseInt(id));

    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

    const [selectedSize, setSelectedSize] = useState('');
    const [showError, setShowError] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    // Scroll to top when product changes
    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedSize('');
        setShowError(false);
        setIsAdded(false);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <Link to="/shop" className="text-accent hover:underline">Return to Shop</Link>
            </div>
        );
    }

    const isWishlisted = isInWishlist(product.id);
    const sizes = ['S', 'M', 'L', 'XL'];

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        if (!selectedSize) {
            setShowError(true);
            return;
        }

        addToCart(product, selectedSize);
        setShowError(false);
        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    return (
        <div className="bg-white pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-gray-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-gray-900">Shop</Link>
                    <span className="mx-2">/</span>
                    <Link to={`/category/${product.category}`} className="hover:text-gray-900">{product.category}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    {/* Image Gallery */}
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col pt-4">
                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-2xl font-semibold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                                    {product.rating} Reviews
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-gray-900">Size</span>
                                <button className="text-sm text-gray-500 underline hover:text-gray-900">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setShowError(false);
                                        }}
                                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${selectedSize === size
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-200 bg-white text-gray-900 hover:border-gray-900'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {showError && (
                                <p className="text-red-500 text-sm mt-2 font-medium">Please select a size before adding to cart.</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4 mb-10">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-4 rounded-xl font-medium text-lg transition-all ${isAdded
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-16 flex items-center justify-center rounded-xl border-2 transition-all ${isWishlisted
                                        ? 'border-accent bg-accent/10 text-accent'
                                        : 'border-gray-200 text-gray-600 hover:border-accent hover:text-accent'
                                    }`}
                            >
                                <Heart size={24} className={isWishlisted ? "fill-accent" : ""} />
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="border-t border-gray-100 pt-8 space-y-4">
                            <div className="flex items-center text-gray-600">
                                <Truck size={20} className="mr-4" />
                                <span>Free shipping on orders over ₹12,450</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <RotateCcw size={20} className="mr-4" />
                                <span>30-day return policy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
