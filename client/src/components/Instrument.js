import React, { Component } from "react"
import { Link } from "react-router-dom"
import InstrumentAPI from "../services/InstrumentAPI"

export default class Instrument extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userRole: localStorage.getItem("role") || "guest", // Default to guest
        }

        // Bind functions to `this`
        this.handleStockChange = this.handleStockChange.bind(this)
        this.handleAddToCart = this.handleAddToCart.bind(this)
    }

    componentDidMount() {
        // Listen for role changes (e.g., after login)
        window.addEventListener("storage", this.updateUserRole)
    }

    updateUserRole = () => {
        this.setState({ userRole: localStorage.getItem("role") || "guest" })
    }

    handleAddToCart = () => {
        const { product } = this.props

        // Retrieve existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem("cart")) || []

        // Check if the product is already in the cart
        const existingItem = cart.find((item) => item.productId === product._id)

        if (existingItem) {
            // If the product is already in the cart, update the quantity
            existingItem.quantity += 1
        } else {
            // If the product is not in the cart, add it with quantity 1
            cart.push({ productId: product._id, quantity: 1, product })
        }

        // Save the updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart))

        alert("Added to cart!")
    }

    handleStockChange = async (change) => {
        const { product, onUpdate } = this.props

        if (!product._id || product._id.length !== 24) {
            alert("Invalid instrument ID")
            return
        }

        if (change < 0 && product.stock + change < 0) {
            alert("Stock cannot be negative")
            return
        }

        try {
            console.log("Updating stock for ID:", product._id) // Debugging
            const action = change > 0 ? "increase" : "decrease"
            const updatedProduct = await InstrumentAPI.updateStock(
                product._id,
                Math.abs(change),
                action
            )

            if (!updatedProduct || updatedProduct.stock === undefined) {
                throw new Error("Failed to update stock.")
            }

            onUpdate({ ...product, stock: updatedProduct.stock })
        } catch (error) {
            alert("Failed to update stock: " + (error.message || "Unknown error"))
        }
    }

    render() {
        const { product, onDelete } = this.props
        const { userRole } = this.state
        return (
            <div className="product-card">
                <div className="image-gallery">
                    {product.images?.length > 0 ? (
                        <>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="main-image"
                            />
                            <div className="thumbnail-container">
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.name} thumbnail ${index}`}
                                        className="thumbnail"
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-image">No Image Available</div>
                    )}
                </div>
                <h2>{product.name}</h2>
                <p>Brand: {product.brand}</p>
                <p>{product.description}</p>
                <p>Rating: {product.rating}</p>
                <p>Reviews: {product.reviews}</p>
                <p>
                    Price:{" "}
                    {product.price !== undefined
                        ? `$${product.price.toFixed(2)}`
                        : "Price not available"}
                </p>
                <p>Stock: {product.stock}</p>

                {userRole === "admin" ? (
                    <div>
                        <button
                            onClick={() => this.handleStockChange(-1)}
                            disabled={product.stock <= 0}
                        >
                            Decrease Stock
                        </button>
                        <button onClick={() => this.handleStockChange(1)}>Increase Stock</button>
                        <button onClick={() => onDelete(product._id)}>Delete</button>
                        <button>
                            <Link to={`/EditInstrument/${product._id}`}>Edit</Link>
                        </button>
                    </div>
                ) : (
                    // User View
                    <button onClick={this.handleAddToCart}>Add to Cart</button>
                )}
            </div>)

    }
}