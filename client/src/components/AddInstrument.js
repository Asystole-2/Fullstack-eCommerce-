import React, {Component} from "react"
import {Redirect }from "react-router-dom"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

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
                        this.setState({
                            name: "",
                            price: "",
                            stock: "",
                            description: "",
                            image: "",
                        })
                        this.setState({redirectToDisplayAllInstruments: true})
                    }
                } else {
                    console.log("Record not added")
                }
            })
            .catch(error => console.error("Error adding instrument:", error))

    }

    render() {

            if (this.state.redirectToDisplayAllInstruments) {
                return <Redirect to="/instruments"/>
            }
            return (
                <div className="form-container">
                    <form onSubmit={this.handleSubmit}>
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
                        <button type="submit">Add Instrument</button>
                    </form>
                </div>
            )
        }
    }

