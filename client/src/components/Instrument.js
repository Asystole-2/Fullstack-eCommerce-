import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Instrument extends Component {
    handleAddToCart = () => {
        const { product } = this.props;

        // Retrieve existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product is already in the cart
        const existingItem = cart.find(item => item.productId === product._id);

        if (existingItem) {
            // If the product is already in the cart, update the quantity
            existingItem.quantity += 1;
        } else {
            // If the product is not in the cart, add it with quantity 1
            cart.push({ productId: product._id, quantity: 1, product });
        }

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        alert('Added to cart!');
    };

    render() {
        const { product } = this.props;
        return (
            <div className="product-card">
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>Brand: {product.brand}</p>
                <p>{product.description}</p>
                <p>Rating: {product.rating}</p>
                <p>Reviews: {product.reviews}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <button onClick={this.handleAddToCart}>Add to Cart</button>
                <p>Stock: {product.stock}</p>

                <button onClick={() => this.handleStockChange(-1)} disabled={product.stock <= 0}>
                    Decrease Stock
                </button>
                <button onClick={() => this.handleStockChange(1)}>
                    Increase Stock
                </button>
                <button onClick={() => this.props.onDelete(product._id)}>Delete</button>
                <button>
                    <Link to={`/EditInstrument/${product._id}`}>Edit</Link>
                </button>
            </div>
        );
    }
}