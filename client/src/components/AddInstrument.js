import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export default class AddInstrument extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            brand: "",
            price: "",
            stock: "",
            description: "",
            images: [],
            newImageURL: "",
            errors: {},
            category: "",
            redirectToDisplayAllInstruments: false
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleAddImage = () => {
        const { newImageURL, images } = this.state;

        // https://stackoverflow.com/questions/4098415/use-regex-to-get-image-url-in-html-js
        if (!/(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg))/i.test(newImageURL)) {
            this.setState({ errors: { images: "Invalid image URL format." } });
            return;
        }

        this.setState({
            // Adds newImageURL to existing image
            images: [...images, newImageURL],
            newImageURL: "",
            errors: {}
        });
    };

    handleRemoveImage = (index) => {
        const updatedImages = [...this.state.images];
        updatedImages.splice(index, 1);
        this.setState({ images: updatedImages });
    };

    validateForm = () => {
        const errors = {};
        if (!this.state.name.trim()) errors.name = "Name is required.";
        if (!/^\d+(\.\d{1,2})?$/.test(this.state.price) || Number(this.state.price) <= 0) errors.price = "Price must be a positive number.";
        if (!/^\d+$/.test(this.state.stock) || Number(this.state.stock) < 0) errors.stock = "Stock must be a non-negative integer.";
        if (this.state.description.trim().length < 10) errors.description = "Description must be at least 10 characters.";
        if (this.state.images.length === 0) errors.images = "At least one image is required.";

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) return;

        try {
            const instrumentObject = {
                name: this.state.name,
                brand: this.state.brand,
                price: Number(this.state.price),
                stock: Number(this.state.stock),
                description: this.state.description,
                images: this.state.images,
                category: this.state.category,
            };

            const res = await axios.post(`${SERVER_HOST}/instruments/add`, instrumentObject, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (res.status === 201 || res.status === 200) {
                this.setState({ redirectToDisplayAllInstruments: true });
            } else {
                console.log("Unexpected response:", res.data);
            }
        } catch (error) {
            console.error("Error adding instrument:", error.response?.data?.errorMessage || error.message);
            this.setState({ errors: { server: "Error adding instrument. Please try again." } });
        }
    };

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllInstruments && <Redirect to="/MainPage" />}

                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.handleChange} />
                    {this.state.errors.name && <p style={{ color: "red" }}>{this.state.errors.name}</p>}

                    <input type="text" name="brand" placeholder="Brand" value={this.state.brand} onChange={this.handleChange} />
                    {this.state.errors.brand && <p style={{ color: "red" }}>{this.state.errors.brand}</p>}

                    <input type="text" name="category" placeholder="Category" value={this.state.category} onChange={this.handleChange} />
                    {this.state.errors.category && <p style={{ color: "red" }}>{this.state.errors.category}</p>}

                    <input type="text" name="price" placeholder="Price" value={this.state.price} onChange={this.handleChange} />
                    {this.state.errors.price && <p style={{ color: "red" }}>{this.state.errors.price}</p>}

                    <input type="text" name="stock" placeholder="Stock" value={this.state.stock} onChange={this.handleChange} />
                    {this.state.errors.stock && <p style={{ color: "red" }}>{this.state.errors.stock}</p>}

                    <textarea name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange} />
                    {this.state.errors.description && <p style={{ color: "red" }}>{this.state.errors.description}</p>}

                    {/* Image Input */}
                    <input type="text" name="newImageURL" placeholder="Image URL" value={this.state.newImageURL} onChange={this.handleChange} />
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

                    <button type="submit" className="green-button">Add</button>
                    <Link className="red-button" to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        );
    }
}