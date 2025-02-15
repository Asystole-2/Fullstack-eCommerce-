import React, { Component } from "react"
import { Redirect, Link } from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {SERVER_HOST} from "../config/global_constants";

export default class EditInstrument extends Component {
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

    componentDidMount() {
        // this.inputToFocus.focus()

        axios.get(`${SERVER_HOST}/instruments/${this.props.match.params.id}`)
        .then(res => {
            if(res.data){
                if(res.data.errorMessage){
                    console.log(res.data.errorMessage)
                }else{
                    this.setState({
                        name: res.data.name,
                        price: res.data.price,
                        stock: res.data.stock,
                        description: res.data.description,
                        image: res.data.image,
                    })
                }
            }else {
                console.log("Record not found")
            }
        })
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const instrumentObject = {
            name: this.state.name,
            price: this.state.price,
            stock: this.state.stock,
            description: this.state.description,
            image: this.state.image,
        }

        axios.put(`${SERVER_HOST}/instruments/${this.props.match.params.id}`, instrumentObject)
            .then(res => {
                if(res.data){
                    if (res.data.errorMessage){
                        console.log(res.data.errorMessage)
                    }else{
                        console.log("Record updated")
                        this.setState({redirectToDisplayAllInstruments: true})
                    }
                }else {
                    console.log("Record not updated")
                }
            })
    }

    render() {
        return (
            <div className="form-container">

                {this.state.redirectToDisplayAllInstruments ? <Redirect to="/instruments" /> : null}

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
