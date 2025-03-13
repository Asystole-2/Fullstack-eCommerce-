// Instrument.js
import React, { Component } from "react";
import InstrumentAPI from "../services/InstrumentAPI";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import axios from "axios";
import { ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_USER } from "../config/global_constants";
import AlertModal from "./AlertModal"; // Import the AlertModal

export default class Instrument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: localStorage.getItem("role") || "guest", // Default to guest
            showModal: false,
            showAlertModal: false, // State for controlling the alert modal
            alertMessage: "", // Message to display in the alert modal
        };

        this.handleStockChange = this.handleStockChange.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.closeAlertModal = this.closeAlertModal.bind(this);
    }

    componentDidMount() {
        // Listen for role changes (e.g., after login)
        window.addEventListener("storage", this.updateUserRole);
    }

    componentWillUnmount() {
        // Clean up the event listener
        window.removeEventListener("storage", this.updateUserRole);
    }

    updateUserRole = () => {
        this.setState({ userRole: localStorage.getItem("role") || "guest" });
    };

    toggleModal = (e) => {
        if (e) {
            e.stopPropagation(); // Stop event propagation
        }
        this.setState((prevState) => ({
            showModal: !prevState.showModal,
        }));
    };

    closeAlertModal = () => {
        this.setState({ showAlertModal: false, alertMessage: "" });
    };

    handleAddToCart = (e) => {
        e.stopPropagation(); // Stop event propagation to prevent the Instrument Modal from opening
        const { product } = this.props;

        // Retrieve existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if the product is already in the cart
        const existingItem = cart.find((item) => item.productId === product._id);

        if (existingItem) {
            // If the product is already in the cart, update the quantity
            existingItem.quantity += 1;
        } else {
            // If the product is not in the cart, add it with quantity 1
            cart.push({ productId: product._id, quantity: 1, product });
        }

        // Save the updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Show the alert modal
        this.setState({ showAlertModal: true, alertMessage: "Added to cart!" });
    };

    handleStockChange = async (change) => {
        const { product, onUpdate } = this.props;

        if (!product._id || product._id.length !== 24) {
            this.setState({ showAlertModal: true, alertMessage: "Invalid instrument ID" });
            return;
        }

        if (change < 0 && product.stock + change < 0) {
            this.setState({ showAlertModal: true, alertMessage: "Stock cannot be negative" });
            return;
        }

        try {
            console.log("Updating stock for ID:", product._id); // Debugging
            const action = change > 0 ? "increase" : "decrease";
            const updatedProduct = await InstrumentAPI.updateStock(
                product._id,
                Math.abs(change),
                action
            );

            if (!updatedProduct || updatedProduct.stock === undefined) {
                throw new Error("Failed to update stock.");
            }

            onUpdate({ ...product, stock: updatedProduct.stock });
        } catch (error) {
            this.setState({
                showAlertModal: true,
                alertMessage: "Failed to update stock: " + (error.message || "Unknown error"),
            });
        }
    };

    render() {
        const { product, onDelete } = this.props;
        const { userRole, showModal, showAlertModal, alertMessage } = this.state;

        const value = product.price ? product.price.toFixed(2) : 0;
        const userAccessLevel = localStorage.getItem("accessLevel");

        return (
            <div className="product-card" onClick={this.toggleModal}>
                <div className="product-card2">
                    <div className="image-gallery">
                        {product.images ? (
                            <img src={product.images[0]} alt={product.name} className="main-image" />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                    </div>
                    <h2>{product.name}</h2>
                    <p>Brand: {product.brand}</p>
                    <p>Rating: {product.rating}</p>
                    <p>Price: ${value}</p>
                    <button
                        className="add-to-cart-button"
                        onClick={this.handleAddToCart} // Add to Cart button click handler
                    >
                        Add to Cart
                    </button>
                </div>

                {/* Instrument Modal */}
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

                {/* Alert Modal */}
                <AlertModal
                    show={showAlertModal}
                    message={alertMessage}
                    onClose={this.closeAlertModal}
                />
            </div>
        );
    }
}