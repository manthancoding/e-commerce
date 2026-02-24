import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id && item.size === size
            );
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, size, quantity: 1 }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !(item.id === productId && item.size === size))
        );
    };

    const updateQuantity = (productId, size, amount) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === productId && item.size === size) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const total = subtotal; // Can add shipping/taxes here if needed

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                subtotal,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
