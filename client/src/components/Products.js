import React, {Component} from "react"
import AddInstrument from "./AddInstrument"
import Instrument from "./Instrument"
import {SERVER_HOST} from "../config/global_constants"
import axios from "axios"
import {Link} from "react-router-dom";

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
        }

        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
    }

    handleAddProduct = (newProduct) => {
        this.setState({products: [...this.state.products, newProduct]})
    }

    // Handle DELETE request
    handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instrument?")) return;

        try {
            const response = await fetch(`${SERVER_HOST}/api/instruments/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Instrument deleted successfully!");
                if (this.state.products) {
                    this.setState({
                        products: this.state.products.filter(item => item._id !== id)
                    });
                }
            } else {
                alert("Error deleting instrument");
            }
        } catch (error) {
            console.error("Error deleting instrument:", error);
        }
    };

    handleUpdateProduct = (updatedProduct) => {
        const updatedProducts = this.state.products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
        )
        this.setState({products: updatedProducts})
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/instruments`)
            .then(res => {
                if (res.data) {
                    console.table(res.data)
                    this.setState({products: res.data})
                } else {
                    console.log("Record not found")
                }
            })
    }

    render() {
        return (
            <div className="product-list">
                <div className="add-new-product">
                    <Link className="blue-button" to={"/AddInstrument"}>Add New Instrument</Link>
                </div>
                <div className="grid">
                    {this.state.products.map((product) => (
                        <Instrument
                            key={product._id}
                            product={product}
                            onDelete={this.handleDelete}
                            onUpdate={this.handleUpdateProduct}
                        />
                    ))}
                </div>
            </div>
        )
    }
}
