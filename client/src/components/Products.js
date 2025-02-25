import React, { Component } from "react"
import AddInstrument from "./AddInstrument"
import Instrument from "./Instrument"
import CategoryDropDown from "./CategoryDropDown"
import BrandDropDown from "./BrandDropDown"
import SortProducts from "./SortProducts"

import { SERVER_HOST } from "../config/global_constants"
import axios from "axios"
import {Link} from "react-router-dom";

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            searchTerm: '',
            brands: [],
            selectedBrand: 'All',
            categories: [],
            selectedCategory: 'All',
            sortOrder: 'default',
        }

        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.handleBrandChange = this.handleBrandChange.bind(this)
        this.handleSortChange = this.handleSortChange.bind(this)
        this.originalProducts = []

    }

    handleAddProduct(newProduct) {
        this.setState({products: [...this.state.products, newProduct]})
    }

    handleDeleteProduct(id) {
        this.setState({
            products: this.state.products.filter((product) => product._id !== id)
        })
    }

    handleUpdateProduct(updatedProduct) {
        const updatedProducts = this.state.products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
        )
        this.setState({products: updatedProducts})
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/instruments`)
            .then(res => {
                if ((res.data)) {
                    console.table(res.data)

                    this.originalProducts = res.data
                    const categories = ["All", ...new Set(res.data.map(item => item.category).filter(Boolean))]
                    const brands = ["All", ...new Set(res.data.map(item => item.brand).filter(Boolean))]

                    this.setState({
                        products: res.data,
                        categories: categories,
                        brands: brands
                    })
                } else {
                    console.log("Record not found")
                }
            })
            .catch(error => console.error("Error fetching instruments:", error))
    }

    handleCategoryChange(e) {
        this.setState({selectedCategory: e.target.value})
    }

    handleBrandChange(e) {
        this.setState({selectedBrand: e.target.value})
    }

    handleSortChange(order) {
        this.setState({sortOrder: order})
    }

    render() {
        const {searchTerm, products, selectedBrand, selectedCategory, sortOrder} = this.state

        var filteredProducts = products.filter(product => {
            return (
                (searchTerm === '' ||
                    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.price?.toString().includes(searchTerm) ||
                    product.rating?.toString().includes(searchTerm) ||
                    product.reviews?.toString().includes(searchTerm)) &&
                (selectedCategory === "All" || product.category?.toLowerCase() === selectedCategory.toLowerCase()) &&
                (selectedBrand === "All" || product.brand?.toLowerCase() === selectedBrand.toLowerCase())
            )
        })

        if (sortOrder === "nameAZ") {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortOrder === "nameZA") {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        } else if (sortOrder === "lowToHigh") {
            filteredProducts.sort((a, b) => a.price - b.price)
        } else if (sortOrder === "highToLow") {
            filteredProducts.sort((a, b) => b.price - a.price)
        } else if (sortOrder === "reviewsHighToLow") {
            filteredProducts.sort((a, b) => b.reviews - a.reviews)
        } else if (sortOrder === "reviewsLowToHigh") {
            filteredProducts.sort((a, b) => a.reviews - b.reviews)
        } else if (sortOrder === "default") {
            filteredProducts = [...this.originalProducts]; // Reset to original order
        }

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

                <CategoryDropDown categories={this.state.categories} handleCategoryChange={this.handleCategoryChange}/>
                <BrandDropDown brands={this.state.brands} handleBrandChange={this.handleBrandChange}/>

                <div className="add-new-product">
                    <Link className="blue-button" to={"/AddInstrument"}>Add New Instrument</Link>
                </div>
                <div>
                    <SortProducts sortOrder={this.state.sortOrder} handleSortChange={this.handleSortChange}/>
                    <div className="grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <Instrument key={product._id} product={product}/>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>
                </div>
            </div>

        )
    }

}