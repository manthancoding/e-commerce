import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900 block mb-4">
                            urban spices.
                        </Link>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            Curated minimal fashion for the modern generation. Elevate your everyday style with our premium collection.
                        </p>
                        <div className="flex space-x-4 text-gray-400">
                            <a href="#" className="hover:text-accent transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-accent transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/category/Women" className="hover:text-accent transition-colors">Women's Fashion</Link></li>
                            <li><Link to="/category/Men" className="hover:text-accent transition-colors">Men's Fashion</Link></li>
                            <li><Link to="/category/Shoes" className="hover:text-accent transition-colors">Shoes</Link></li>
                            <li><Link to="/category/Accessories" className="hover:text-accent transition-colors">Accessories</Link></li>
                            <li><Link to="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Size Guide</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Track Order</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
                        <p className="text-gray-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 min-w-0 bg-white border border-gray-200 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-accent"
                            />
                            <button
                                type="submit"
                                className="bg-gray-900 hover:bg-gray-800 text-white rounded-r-md px-4 py-2 transition-colors flex items-center justify-center"
                            >
                                <Mail size={18} />
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} urban spices. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
