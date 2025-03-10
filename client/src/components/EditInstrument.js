import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export default class EditInstrument extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            brand: "",
            price: "",
            stock: "",
            description: "",
            category: "",
            images: [],  // Store multiple images as an array
            newImageURL: "", // Store new image input
            errors: {},
            redirectToDisplayAllInstruments: false
        };
    }

    componentDidMount = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please log in.");
            return;
        }

        try {
            const response = await axios.get(
                `${SERVER_HOST}/instruments/${this.props.match.params.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data && Object.keys(response.data).length > 0) {
                this.setState({
                    name: response.data.name || "",
                    brand: response.data.brand || "",
                    price: response.data.price || "",
                    stock: response.data.stock || "",
                    description: response.data.description || "",
                    category: response.data.category || "",
                    images: response.data.images || [], // Ensure images is an array
                });
            } else {
                console.log("Record not found");
            }
        } catch (error) {
            console.error("Error fetching instrument:", error.response || error.message);
        }
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleAddImage = () => {
        const { newImageURL, images } = this.state;

        if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(newImageURL)) {
            this.setState({ errors: { images: "Invalid image URL format." } });
            return;
        }

        this.setState({
            images: [...images, newImageURL],  // Add new image to array
            newImageURL: "", // Reset input
            errors: {}
        });
    };

    handleRemoveImage = (index) => {
        const updatedImages = [...this.state.images];
        updatedImages.splice(index, 1);
        this.setState({ images: updatedImages });
    };

    validateForm = () => {
        let errors = {};
        const { name, price, stock, description, images } = this.state;

        if (name.trim().length < 3 || name.trim().length > 50) {
            errors.name = "Name must be between 3 and 50 characters.";
        }

        if (!/^\d+(\.\d{1,2})?$/.test(price) || Number(price) <= 0) {
            errors.price = "Price must be a positive number.";
        }

        if (!/^\d+$/.test(stock) || Number(stock) < 0) {
            errors.stock = "Stock must be a non-negative integer.";
        }

        if (description.trim().length < 10) {
            errors.description = "Description must be at least 10 characters.";
        }

        if (images.length === 0) {
            errors.images = "At least one image is required.";
        }

        this.setState({ errors });

        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to update instruments.");
            return;
        }

        if (!this.validateForm()) {
            return;
        }

        try {
            const instrumentObject = {
                name: this.state.name,
                brand: this.state.brand,
                price: this.state.price,
                stock: this.state.stock,
                description: this.state.description,
                category: this.state.category,
                images: this.state.images, // Send images array
            };

            const response = await axios.put(
                `${SERVER_HOST}/instruments/${this.props.match.params.id}`,
                instrumentObject,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200) {
                console.log("Record updated successfully");
                this.setState({ redirectToDisplayAllInstruments: true });
            } else {
                console.error("Unexpected response:", response.data);
            }
        } catch (error) {
            console.error("Error updating instrument:", error.response?.data?.errorMessage || error.message);
        }
    };

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllInstruments && <Redirect to="/MainPage" />}

                <form onSubmit={this.handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    {this.state.errors.name && <p style={{ color: "red" }}>{this.state.errors.name}</p>}

                    <label>Category</label>
                    <input type="text" name="category" value={this.state.category} onChange={this.handleChange} />

                    <label>Price</label>
                    <input type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    {this.state.errors.price && <p style={{ color: "red" }}>{this.state.errors.price}</p>}

                    <label>Stock</label>
                    <input type="text" name="stock" value={this.state.stock} onChange={this.handleChange} />
                    {this.state.errors.stock && <p style={{ color: "red" }}>{this.state.errors.stock}</p>}

                    <label>Description</label>
                    <textarea name="description" value={this.state.description} onChange={this.handleChange} />

                    <label>Brand</label>
                    <input type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />

                    {/* Image Input */}
                    <label>Images</label>
                    <input type="text" name="newImageURL" placeholder="New Image URL" value={this.state.newImageURL} onChange={this.handleChange} />
                    <button type="button" onClick={this.handleAddImage}>Add Image</button>
                    {this.state.errors.images && <p style={{ color: "red" }}>{this.state.errors.images}</p>}

                    {/* Image Previews */}
                    <div className="image-preview-container">
                        {this.state.images.map((img, index) => (
                            <div key={index} className="image-preview-wrapper">
                                <img src={img} alt={`Preview ${index + 1}`} className="image-preview" />
                                <button type="button" onClick={() => this.handleRemoveImage(index)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    {this.state.errors.server && <p style={{ color: "red" }}>{this.state.errors.server}</p>}

                    <button type="submit" className="green-button">Update</button>
                    <Link className="red-button" to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        );
    }
}