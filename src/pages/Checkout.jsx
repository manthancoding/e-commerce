import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

export const Checkout = () => {
    const { cart, subtotal, total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // In a real app, process payment here
        setIsOrderPlaced(true);
        clearCart();
    };

    if (isOrderPlaced) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight text-center">Order Confirmed!</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Thank you for your purchase. Your order has been received and is being processed.
                    A confirmation email has been sent to {formData.email || 'your email'}.
                </p>
                <Link
                    to="/shop"
                    className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Checkout Form */}
                    <div className="lg:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                        <form onSubmit={handlePlaceOrder} className="space-y-10">

                            {/* Shipping Details */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input
                                            required
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            required
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code</label>
                                        <input
                                            required
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                                <div className="space-y-4">
                                    <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-4 w-4 text-gray-900 cursor-pointer"
                                            />
                                            <span className="ml-3 font-medium text-gray-900">Credit / Debit Card</span>
                                        </div>
                                    </label>
                                    <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="upi"
                                                checked={paymentMethod === 'upi'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-4 w-4 text-gray-900 cursor-pointer"
                                            />
                                            <span className="ml-3 font-medium text-gray-900">UPI</span>
                                        </div>
                                    </label>
                                    <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-4 w-4 text-gray-900 cursor-pointer"
                                            />
                                            <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-lg"
                                >
                                    Place Order • ₹{total.toLocaleString('en-IN')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <ul className="divide-y divide-gray-100 mb-6">
                                {cart.map((item) => (
                                    <li key={`${item.id}-${item.size}`} className="py-4 flex">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-20 object-cover rounded-lg bg-gray-50"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-3 mb-6 flex flex-col pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
