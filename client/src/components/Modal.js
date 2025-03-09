import React, { Component } from "react"
import { Link } from "react-router-dom"

export default class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expandedImage: null, // State to track the expanded image
            currentImageIndex: 0, // State to track the current image index
        }

        // Bind functions to `this`
        this.expandImage = this.expandImage.bind(this)
        this.closeExpandedImage = this.closeExpandedImage.bind(this)
        this.showNextImage = this.showNextImage.bind(this)
        this.showPreviousImage = this.showPreviousImage.bind(this)
    }

    expandImage = (imageSrc, index) => {
        this.setState({ expandedImage: imageSrc, currentImageIndex: index })
    }

    closeExpandedImage = () => {
        this.setState({ expandedImage: null })
    }

    showNextImage = (e) => {
        e.stopPropagation() // Stop event propagation
        const { product } = this.props
        const { currentImageIndex } = this.state
        const images = product.images || []
        const nextIndex = (currentImageIndex + 1) % images.length
        this.setState({
            currentImageIndex: nextIndex,
            expandedImage: images[nextIndex],
        })
    }

    showPreviousImage = (e) => {
        e.stopPropagation()
        const { product } = this.props
        const { currentImageIndex } = this.state
        const images = product.images || []
        const prevIndex =
            (currentImageIndex - 1 + images.length) % images.length
        this.setState({
            currentImageIndex: prevIndex,
            expandedImage: images[prevIndex],
        })
    }

    render() {
        const { showModal, toggleModal, product, userRole, onDelete, handleAddToCart, handleStockChange, onUpdate } = this.props
        const { expandedImage } = this.state
        const images = product.images || [] // Fallback to an empty array if images is undefined

        return (
            <>
                {showModal && (
                    <div className="modal-overlay" onClick={toggleModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal" onClick={toggleModal}>
                                &times;
                            </button>
                            <div className="modal-image-gallery">
                                {images.length > 0 ? (
                                    <>
                                        <img
                                            src={images[0]}
                                            alt={product.name}
                                            className="modal-main-image"
                                            onClick={() => this.expandImage(images[0], 0)}
                                        />
                                        <div className="modal-thumbnail-container">
                                            {images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`${product.name} thumbnail ${index}`}
                                                    className="modal-thumbnail"
                                                    onClick={() => this.expandImage(img, index)}
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
                                <div className="admin-buttons">
                                    <button
                                        onClick={() => handleStockChange(-1)}
                                        disabled={product.stock <= 0}
                                    >
                                        Decrease Stock
                                    </button>
                                    <button onClick={() => handleStockChange(1)}>
                                        Increase Stock
                                    </button>
                                    <button onClick={() => onDelete(product._id)}>Delete</button>
                                    <button>
                                        <Link to={`/EditInstrument/${product._id}`}>Edit</Link>
                                    </button>
                                </div>
                            ) : (
                                // User View
                                <button className="add-to-cart-button" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {expandedImage && (
                    <div className="expanded-image-overlay">
                        <button className="nav-button prev-button" onClick={this.showPreviousImage}>
                            &#10094;
                        </button>
                        <img
                            src={expandedImage}
                            alt="Expanded"
                            className="expanded-image"
                            onClick={(e) => e.stopPropagation()} // Prevent clicks on the image from closing it
                        />
                        <button className="nav-button next-button" onClick={this.showNextImage}>
                            &#10095;
                        </button>
                        <button className="close-expanded-image" onClick={this.closeExpandedImage}>
                            &times;
                        </button>
                    </div>
                )}
            </>
        )
    }
}