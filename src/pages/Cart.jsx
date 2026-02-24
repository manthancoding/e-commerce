import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, total } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Discover our latest styles and find something you love.
                </p>
                <Link
                    to="/shop"
                    className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {cart.map((item) => (
                                    <li key={`${item.id}-${item.size}`} className="p-6 flex items-start sm:items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-32 object-cover rounded-xl bg-gray-50"
                                        />

                                        <div className="ml-6 flex-1 flex flex-col sm:flex-row justify-between">
                                            <div>
                                                <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-accent transition-colors text-lg">
                                                    {item.name}
                                                </Link>
                                                <p className="text-gray-500 mt-1">Size: {item.size}</p>
                                                <p className="font-medium text-gray-900 mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">

                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-200 rounded-full bg-white p-1 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, -1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-sm text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 sm:mt-4 rounded-full hover:bg-red-50"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes</span>
                                    <span className="font-medium text-gray-900">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 mb-8">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full bg-gray-900 text-white rounded-xl py-4 flex flex-row items-center justify-center font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                            >
                                Proceed to Checkout <ArrowRight size={18} className="ml-2" />
                            </Link>

                            <div className="mt-6 text-center text-xs text-gray-500">
                                <p>Secure checkout powered by Stripe.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
