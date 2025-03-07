import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"
import LinkInClass from "./LinkInClass";

export default class AddInstrument extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            price: "",
            stock: "",
            description: "",
            image: "",
            redirectToDisplayAllInstruments: localStorage.accessLevel < ACCESS_LEVEL_ADMIN
        }

    }

    componentDidMount() {
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

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
    };

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllInstruments ? <Redirect to="/instruments"/> : null}

                <form>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={this.state.price}
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={this.state.description}
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        name="stock"
                        placeholder="Stock"
                        value={this.state.stock}
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={this.state.image}
                        onChange={this.handleChange}
                    />

                    <button>
                        <LinkInClass value="Add" className="green-button" onClick={this.handleSubmit}/>
                    </button>

                    <Link className="red-button" to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        )
    }
}

