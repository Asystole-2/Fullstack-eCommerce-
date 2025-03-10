import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LinkInClass from "../components/LinkInClass";
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
            image: "",
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
            console.log("Fetching instrument with ID:", this.props.match.params.id);
            console.log("Token being sent:", `Bearer ${token}`);

            const response = await axios.get(
                `${SERVER_HOST}/instruments/${this.props.match.params.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("API Response:", response.data);

            if (response.data && Object.keys(response.data).length > 0) {
                this.setState({
                    name: response.data.name || "",
                    brand: response.data.brand || "",
                    price: response.data.price || "",
                    stock: response.data.stock || "",
                    description: response.data.description || "",
                    category: response.data.category || "",
                    image: response.data.image || "",
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

    validateForm = () => {
        let errors = {};
        const { name, price, stock, description, image } = this.state;

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

        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(image)) {
            errors.image = "Invalid image URL.";
        }

        this.setState({ errors });

        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        console.log(token)

        if (!token) {
            console.error("User is not logged in");
            alert("Please log in to update instruments.");
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
                image: this.state.image
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
                console.log(`Record updated successfully`);
                this.setState({ redirectToDisplayAllInstruments: true });
            } else {
                console.error(`Unexpected response:`, response.data);
            }
        } catch (error) {
            console.error("Error updating instrument:", error.response?.data?.errorMessage || error.message);
        }
    };

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllInstruments ? <Redirect to="/MainPage" /> : null}

                <form onSubmit={this.handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    {this.state.errors.name && <p style={{ color: "red" }}>{this.state.errors.name}</p>}

                    <label>Category</label>
                    <input type="text" name="category" value={this.state.category} onChange={this.handleChange} />
                    {this.state.errors.category && <p style={{ color: "red" }}>{this.state.errors.category}</p>}

                    <label>Price</label>
                    <input type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    {this.state.errors.price && <p style={{ color: "red" }}>{this.state.errors.price}</p>}

                    <label>Stock</label>
                    <input type="text" name="stock" value={this.state.stock} onChange={this.handleChange} />
                    {this.state.errors.stock && <p style={{ color: "red" }}>{this.state.errors.stock}</p>}

                    <label>Description</label>
                    <input type="text" name="description" value={this.state.description} onChange={this.handleChange} />
                    {this.state.errors.description && <p style={{ color: "red" }}>{this.state.errors.description}</p>}

                    <label>Image</label>
                    <input type="text" name="image" value={this.state.image} onChange={this.handleChange} />
                    {this.state.errors.image && <p style={{ color: "red" }}>{this.state.errors.image}</p>}

                    <label>Brand</label>
                    <input type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />
                    {this.state.errors.brand && <p style={{ color: "red" }}>{this.state.errors.brand}</p>}

                    {this.state.errors.server && <p style={{ color: "red" }}>{this.state.errors.server}</p>}

                    <button type="submit" className="green-button">Update</button>
                    <Link className="red-button" to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        );
    }
}
