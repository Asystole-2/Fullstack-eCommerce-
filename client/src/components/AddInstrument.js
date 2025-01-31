import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {SERVER_HOST} from "../config/global_constants"


export default class AddInstrument extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            price: "",
            stock: "",
            description: "",
            image: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    componentDidMount() {
<<<<<<< bens-branch
        // this.inputToFocus.focus()
=======
    
>>>>>>> main
    }


    handleInputChange(event) {
        const {name, value} = event.target
        this.setState({[name]: value})
    }

    handleSubmit(event) {
        event.preventDefault()
        const newProduct = {...this.state, id: Date.now()}
        this.props.onAddProduct(newProduct)

        // Reset the form
        this.setState({
            name: "",
            price: "",
            description: "",
            stock: "",
            image: "",
        })
    }

    // axios.post(`${SERVER_HOST}/cars`, carObject)
    //     .then(res =>
    //     {
    //         if(res.data)
    //         {
    //             if (res.data.errorMessage)
    //             {
    //                 console.log(res.data.errorMessage)
    //             }
    //             else
    //             {
    //                 console.log("Record added")
    //                 this.setState({redirectToDisplayAllCars:true})
    //             }
    //         }
    //         else
    //         {
    //             console.log("Record not added")
    //         }
    //     })


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={this.state.price}
                    onChange={this.handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                />
                <input
                    type="text"
                    name="stock"
                    placeholder="Stock"
                    value={this.state.stock}
                    onChange={this.handleInputChange}
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={this.state.image}
                    onChange={this.handleInputChange}
                />
                <button type="submit">Add Instrument</button>
            </form>
        )
    }
}

