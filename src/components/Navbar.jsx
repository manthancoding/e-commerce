import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, LogOut } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const { isAuthenticated, user, logout } = useAuth();

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlist.length;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900 flex-shrink-0">
                        urban spices.
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent transition-colors"
                                autoComplete="off"
                            />
                            <Search className="absolute left-4 top-2.5 text-gray-400" size={18} />
                        </form>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/shop" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Shop
                        </Link>

                        <div className="flex items-center space-x-5 border-l pl-5 border-gray-200">
                            <Link to="/wishlist" className="relative text-gray-600 hover:text-accent transition-colors">
                                <Heart size={22} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/cart" className="relative text-gray-600 hover:text-accent transition-colors">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="text-gray-600 hover:text-accent transition-colors font-medium">
                                        {user?.full_name?.split(' ')[0] || 'Account'}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-600 hover:text-accent transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={22} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-accent transition-colors font-medium">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/90 transition-colors font-medium">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center space-x-4">
                        <Link to="/cart" className="relative text-gray-600">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-4 shadow-lg absolute w-full left-0">
                    <form onSubmit={handleSearch} className="relative mt-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-accent"
                        />
                        <Search className="absolute left-4 top-2.5 text-gray-400" size={18} />
                    </form>
                    <div className="flex flex-col space-y-3 pt-2">
                        <Link
                            to="/shop"
                            className="text-gray-600 hover:text-accent block text-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/wishlist"
                            className="text-gray-600 hover:text-accent flex items-center justify-between text-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="bg-accent text-white text-xs py-1 px-2 rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-accent block text-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-accent flex items-center gap-2 text-lg font-medium mt-2 pt-2 border-t border-gray-200"
                                >
                                    <LogOut size={20} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-accent block text-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-accent text-white px-4 py-2 rounded-full text-lg font-medium text-center hover:bg-accent/90 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
