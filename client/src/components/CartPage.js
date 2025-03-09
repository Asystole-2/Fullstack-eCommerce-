import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BuyProduct from './BuyProduct'

export default class CartPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: []
        }
    }

    componentDidMount() {
        // Retrieve cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || []
        this.setState({ cart: storedCart })
    }

    handlePurchaseSuccess = () => {
        localStorage.removeItem('cart')
        this.setState({ cart: [] })
    }

    handleRemoveFromCart = (productId) => {
        // Filter out the item to be removed
        const updatedCart = this.state.cart.filter(item => item.productId !== productId)
        this.setState({ cart: updatedCart })
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    handleQuantityChange = (productId, delta) => {
        const updatedCart = this.state.cart.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) }
            }
            return item
        })
        this.setState({ cart: updatedCart })
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    render() {
        const { cart } = this.state
        const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)

        if (!cart.length) {
            return (
                <div className="cart-page">
                    <div>
                        <p>Your cart is empty.</p>
                    </div>
                    <Link to="/MainPage" className="continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            )
        }

        return (
            <div className="cart-page">
                <h1>Shopping Cart</h1>
                <ul className="cart-list">
                    {cart.map(item => (
                        <li className="cart-item" key={item.productId}>
                            {item.product.images?.length > 0 ? (
                                <img
                                    className="cart-item-image"
                                    src={item.product.images[0]}
                                    alt={`${item.product.name} main`}
                                />
                            ) : (
                                <div className="no-image">No Image Available</div>
                            )}
                            <div className="product-info">
                                <h4>Product: {item.product.name}</h4>
                                <h4>Brand: {item.product.brand}</h4>
                                <h4>Cost: {item.quantity} x ${item.product.price.toFixed(2)}</h4>
                            </div>

                            <div className="quantity-controls">
                                <button
                                    className="quantity-button"
                                    onClick={() => this.handleQuantityChange(item.productId, -1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="quantity-button"
                                    onClick={() => this.handleQuantityChange(item.productId, 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => this.handleRemoveFromCart(item.productId)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                <p className="total-price">Total: ${totalAmount}</p>

                <BuyProduct
                    cartItems={cart}
                    total={totalAmount}
                    onSuccess={this.handlePurchaseSuccess}
                />
                <Link to="/MainPage" className="continue-shopping">
                    Continue Shopping
                </Link>
            </div>
        )
    }
}

