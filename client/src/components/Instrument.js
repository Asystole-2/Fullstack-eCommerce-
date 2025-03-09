import React, {Component} from "react"
import InstrumentAPI from "../services/InstrumentAPI"
import Modal from "./Modal"
import {Link} from "react-router-dom"
import axios from 'axios'
import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_USER} from "../config/global_constants";

export default class Instrument extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userRole: localStorage.getItem("role") || "guest", // Default to guest
            showModal: false,
        }


        this.handleStockChange = this.handleStockChange.bind(this)
        this.handleAddToCart = this.handleAddToCart.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    componentDidMount() {
        // Listen for role changes (e.g., after login)
        window.addEventListener("storage", this.updateUserRole)
    }

    updateUserRole = () => {
        this.setState({userRole: localStorage.getItem("role") || "guest"})
    }

    toggleModal = (e) => {
        if (e) {
            e.stopPropagation()
        }
        this.setState((prevState) => ({
            showModal: !prevState.showModal,
        }))
    }

    handleAddToCart = () => {
        const {product} = this.props

        // Retrieve existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem("cart")) || []

        // Check if the product is already in the cart
        const existingItem = cart.find((item) => item.productId === product._id)

        if (existingItem) {
            // If the product is already in the cart, update the quantity
            existingItem.quantity += 1
        } else {
            // If the product is not in the cart, add it with quantity 1
            cart.push({productId: product._id, quantity: 1, product})
        }

        // Save the updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart))

        alert("Added to cart!")
    }

    handleStockChange = async (change) => {
        const {product, onUpdate} = this.props

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

            onUpdate({...product, stock: updatedProduct.stock})
        } catch (error) {
            alert("Failed to update stock: " + (error.message || "Unknown error"))
        }
    }

    render() {
        const {product, onDelete} = this.props
        const {userRole, showModal} = this.state

        const value = product.price ? product.price.toFixed(2) : 0
        const userAccessLevel = localStorage.getItem("accessLevel");
        return (
            <div className="product-card" onClick={this.toggleModal}>
                <div className="product-card2">
                    <div className="image-gallery">
                        {product.images?.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="main-image"
                            />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                    </div>
                    <h2>{product.name}</h2>
                    <p>Brand: {product.brand}</p>
                    <p>Rating: {product.rating}</p>
                    <p>Price: ${value}</p>
                    {userAccessLevel >=  ACCESS_LEVEL_USER ?
                        <button className="add-to-cart-button" onClick={this.handleAddToCart}>
                            Add to Cart
                        </button>
                        :
                        null
                    }
                </div>

                <Modal
                    showModal={showModal}
                    toggleModal={this.toggleModal}
                    product={{ ...product, images: product.images || [] }}
                    userRole={userRole}
                    onDelete={onDelete}
                    handleAddToCart={this.handleAddToCart}
                    handleStockChange={this.handleStockChange}
                    onUpdate={this.props.onUpdate}
                />
            </div>
        )
    }
}