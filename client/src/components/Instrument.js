import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import InstrumentAPI from "../services/InstrumentAPI";

export default class Instrument extends Component {
    handleAddToCart = async () => {
        const { product } = this.props
        const userId = localStorage.getItem('userId')

        // Check if userId exists before making the request
        if (!userId) {
            alert('You must be logged in to add items to the cart.')
            return
        }

        try {
            await axios.post(`/api/cart/${userId}/add`, { productId: product._id, quantity: 1 })
            alert('Added to cart!')
        } catch (error) {
            console.error('Failed to add to cart:', error)
            alert('Failed to add to cart')
        }
    };

    render() {
        const { product } = this.props
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
        )
    }
}
