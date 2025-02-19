import React, {Component} from "react"
import AddInstrument from "./AddInstrument"
import Instrument from "./Instrument"
import {SERVER_HOST} from "../config/global_constants"
import axios from "axios"

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            searchTerm: '',
        }

        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
    }

    handleAddProduct = (newProduct) => {
        this.setState({products: [...this.state.products, newProduct]})
    }

    handleDeleteProduct = (id) => {
        this.setState({
            products: this.state.products.filter((product) => product._id !== id)
        })
    }

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

        const {searchTerm, products} = this.state

        const filteredProducts = products.filter(product => {
            return (
                (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.price?.toString().includes(searchTerm) ||
                    product.rating?.toString().includes(searchTerm) ||
                    product.reviews?.toString().includes(searchTerm)
                )
            )
        })
        return (
            <div className="product-list">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder="Search product name, price or description"
                        value={searchTerm}
                        onChange={e => this.setState({searchTerm: e.target.value})}
                    />
                </div>
                <AddInstrument onAddProduct={this.handleAddProduct}/>
                {/*<div className="grid">*/}
                {/*    {this.state.products.map((product) => (*/}
                {/*        <Instrument*/}
                {/*            key={product._id}*/}
                {/*            product={product}*/}
                {/*            onDelete={this.handleDeleteProduct}*/}
                {/*            onUpdate={this.handleUpdateProduct}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</div>*/}
                <div className="grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Instrument
                                key={product._id}
                                product={product}
                                onDelete={this.handleDeleteProduct}
                                onUpdate={this.handleUpdateProduct}
                            />
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        )
    }
}
