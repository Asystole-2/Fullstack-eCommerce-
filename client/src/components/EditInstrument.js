import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {SERVER_HOST} from "../config/global_constants";

export default class EditInstrument extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: ``,
            price: ``,
            stock: ``,
            description: ``,
            image: ``,
            redirectToDisplayAllInstruments: false
        }
    }

    componentDidMount = async () => {
        const token = localStorage.getItem("token"); // ✅ Retrieve JWT

        if (!token) {
            console.error("User is not logged in");
            alert("Please log in to view this instrument.");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:4000/instruments/${this.props.match.params.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Attach JWT
                    },
                }
            );

            if (response.data) {
                this.setState({
                    name: response.data.name || "",
                    price: response.data.price || "",
                    stock: response.data.stock || "",
                    description: response.data.description || "",
                    image: response.data.image || "",
                });
            } else {
                console.log("Record not found");
            }
        } catch (error) {
            console.error("Error fetching instrument:", error.response?.data?.errorMessage || error.message);
        }
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token"); // ✅ Retrieve JWT token
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
                image: this.state.image
            };

            const response = await axios.put(
                `http://localhost:4000/instruments/${this.props.match.params.id}`,
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

                {this.state.redirectToDisplayAllInstruments ? <Redirect to="/instruments"/> : null}

                <form>
                    <label>Name</label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>

                    <label>Price</label>
                    <input type="text" name="price" value={this.state.price} onChange={this.handleChange}/>

                    <label>Stock</label>
                    <input type="text" name="stock" value={this.state.stock} onChange={this.handleChange}/>

                    <label>Description</label>
                    <input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>

                    <label>Image</label>
                    <input type="text" name="image" value={this.state.image} onChange={this.handleChange}/>

                    <LinkInClass value="Update" onClick={this.handleSubmit}/>

                    <Link to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        )
    }
}
