import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";

const CartPage = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const handleRemoveFromCart = (productId) => {
        // Filter out the item to be removed
        const updatedCart = cart.filter(item => item.productId !== productId);
        setCart(updatedCart);
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (productId, delta) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    if (!cart.length) {
        return (
            <>
                <Navbar />
                <div>
                    <p>Your cart is empty.</p>
                </div>
            </>
        );
    }

    return (
        <div>
            <Navbar />
            <h1>Shopping Cart</h1>
            <Link to="/MainPage">Continue Shopping</Link>
            <ul>
                {cart.map(item => (
                    <li key={item.productId}>
                        {item.product.name} - {item.quantity} x ${item.product.price.toFixed(2)}
                        <button onClick={() => handleQuantityChange(item.productId, -1)} disabled={item.quantity <= 1}>-</button>
                        <button onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                        <button onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                    </li>
                ))}
            </ul>
            <p>Total: ${cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</p>
        </div>
    );
};

export default CartPage;
