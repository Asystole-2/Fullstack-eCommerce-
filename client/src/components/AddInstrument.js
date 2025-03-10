<<<<<<< HEAD
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
=======
import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"
>>>>>>> admin-login3
import LinkInClass from "./LinkInClass";

export default class AddInstrument extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: "",
            stock: "",
            description: "",
            image: "",
<<<<<<< HEAD
            errors: {},
            redirectToDisplayAllInstruments: false
        };
    }

=======
            redirectToDisplayAllInstruments: localStorage.accessLevel < ACCESS_LEVEL_ADMIN
        }

    }

    componentDidMount() {
    }

>>>>>>> admin-login3
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

<<<<<<< HEAD
    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.validateForm()) return;

        const instrumentObject = {
            name: this.state.name,
            price: Number(this.state.price),
            stock: Number(this.state.stock),
            description: this.state.description,
            image: this.state.image
        };

        axios.post(`${SERVER_HOST}/instruments`, instrumentObject)
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        this.setState({ errors: { server: res.data.errorMessage } });
                    } else {
                        console.log("Record added");
                        this.setState({ redirectToDisplayAllInstruments: true });
                    }
                } else {
                    this.setState({ errors: { server: "Record not added." } });
                }
            })
            .catch(error => {
                console.error("Error adding instrument:", error);
                this.setState({ errors: { server: "Error adding instrument. Try again." } });
            });
=======
    handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const instrumentObject = {
                name: this.state.name,
                price: Number(this.state.price),
                stock: Number(this.state.stock),
                description: this.state.description,
                image: this.state.image // Ensure this is a valid URL or handle FormData if it's a file
            };

            const res = await axios.post(`${SERVER_HOST}/instruments/add`, instrumentObject, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (res.status === 201 || res.status === 200) {
                console.log("Record added");
                this.setState({ redirectToDisplayAllInstruments: true });
            } else {
                console.log("Unexpected response:", res.data);
            }
        } catch (error) {
            console.error("Error adding instrument:", error.response?.data?.errorMessage || error.message);
        }
>>>>>>> admin-login3
    };

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllInstruments ? <Redirect to="/instruments" /> : null}

                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                    {this.state.errors.name && <p style={{ color: "red" }}>{this.state.errors.name}</p>}

                    <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={this.state.price}
                        onChange={this.handleChange}
                    />
                    {this.state.errors.price && <p style={{ color: "red" }}>{this.state.errors.price}</p>}

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={this.state.description}
                        onChange={this.handleChange}
                    />
                    {this.state.errors.description && <p style={{ color: "red" }}>{this.state.errors.description}</p>}

                    <input
                        type="text"
                        name="stock"
                        placeholder="Stock"
                        value={this.state.stock}
                        onChange={this.handleChange}
                    />
                    {this.state.errors.stock && <p style={{ color: "red" }}>{this.state.errors.stock}</p>}

                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={this.state.image}
                        onChange={this.handleChange}
                    />
                    {this.state.errors.image && <p style={{ color: "red" }}>{this.state.errors.image}</p>}

                    {this.state.errors.server && <p style={{ color: "red" }}>{this.state.errors.server}</p>}

                    <button type="submit" className="green-button">
                        Add
                    </button>

                    <Link className="red-button" to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        );
    }
}
