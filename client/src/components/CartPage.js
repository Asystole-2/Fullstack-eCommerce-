import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Navbar from "./Navbar"

const CartPage = () => {
    const [cart, setCart] = useState([])

    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || []
        setCart(storedCart)
    }, [])

    const handleRemoveFromCart = (productId) => {
        // Filter out the item to be removed
        const updatedCart = cart.filter(item => item.productId !== productId)
        setCart(updatedCart)
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const handleQuantityChange = (productId, delta) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId) {
                return {...item, quantity: Math.max(1, item.quantity + delta)}
            }
            return item
        })
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    if (!cart.length) {
        return (
            <>
                <Navbar/>
                <div className="cart-page">
                    <div>
                        <p>Your cart is empty.</p>
                    </div>
                    <Link to="/MainPage" className="continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            </>
        )
    }

    return (
        <><Navbar/>
            <div className="cart-page">
                <h1>Shopping Cart</h1>
                <ul className="cart-list">
                    {cart.map(item => (
                        <li className="cart-item" key={item.productId}>
                            {item.product.images?.length > 0 ? (
                                <img
                                    className="cart-item-image"
                                    key={0}
                                    src={item.product.images[0]}
                                    alt={`${item.product.name} main`}
                                />
                            ) : (
                                <div className="no-image">No Image Available</div>
                            )}
                            <div className="product-info">
                                <h4>Product: {item.product.name} </h4>
                                <h4>Brand: {item.product.brand}</h4>
                                <h4>Cost: {item.quantity} x ${item.product.price.toFixed(2)}</h4>
                            </div>

                            <div className="quantity-controls">
                                <button
                                    className="quantity-button"
                                    onClick={() => handleQuantityChange(item.productId, -1)}
                                    disabled={item.quantity <= 1}
                                > -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="quantity-button"
                                    onClick={() => handleQuantityChange(item.productId, 1)}
                                > +
                                </button>
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveFromCart(item.productId)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                <p className="total-price">
                    Total: ${cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}
                </p>

                {/* Continue Shopping */}
                <Link to="/MainPage" className="continue-shopping">
                    Continue Shopping
                </Link>
            </div>
        </>
    )
}

export default CartPage
