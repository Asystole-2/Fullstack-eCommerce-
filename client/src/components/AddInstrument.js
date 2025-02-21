import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
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
            redirectToDisplayAllInstruments: false
        }

    }

    // componentDidMount() {
    //     this.inputToFocus.focus()
    // }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const instrumentObject = {
            name: this.state.name,
            price: Number(this.state.price),
            stock: Number(this.state.stock),
            description: this.state.description,
            image: this.state.image
        }
        axios.post(`${SERVER_HOST}/instruments`, instrumentObject)
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    } else {
                        console.log("Record added")
                        this.setState({redirectToDisplayAllInstruments: true})
                    }
                } else {
                    console.log("Record not added")
                }
            })
            .catch(error => console.error("Error adding instrument:", error))

    }

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllInstruments ? <Redirect to="/instruments" /> : null}

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

                    <LinkInClass value="Add" className="green-button" onClick={this.handleSubmit}/>

                    <Link className="red-button" to={"/MainPage"}>Cancel</Link>
                </form>
            </div>
        )
    }
}

