import React, { Component } from "react"
import addInstrument from "./addInstrument"
import instrument from "./instrument"

import {SERVER_HOST} from "../config/global_constants"
import axios from "axios"

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: []
        }

        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
    }

    handleAddProduct = (newProduct) => {
        this.setState({ products: [...this.state.products, newProduct] })
    }

    handleDeleteProduct = (id) => {
        this.setState({
            products: this.state.products.filter((product) => product.id !== id)
        })
    }

    handleUpdateProduct = (updatedProduct) => {
        const updatedProducts = this.state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
        )
        this.setState({ products: updatedProducts })
    }

    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/cars`)
            .then(res =>
            {
                if(res.data)
                {
                    if (res.data.errorMessage)
                    {
                        console.log(res.data.errorMessage)
                    }
                    else
                    {
                        console.log("Records read")
                        this.setState({cars: res.data})
                    }
                }
                else
                {
                    console.log("Record not found")
                }
            })
    }

    render() {
        return (
            <div className="product-list">
                <addInstrument onAddProduct={this.handleAddProduct} />
                <div className="grid">
                    {this.state.products.map((product) => (
                        <instrument
                            key={product.id}
                            product={product}
                            onDelete={this.handleDeleteProduct}
                            onUpdate={this.handleUpdateProduct}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

