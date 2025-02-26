import React, { Component } from "react"
import Instrument from "./Instrument"
import CategoryDropDown from "./CategoryDropDown"
import BrandDropDown from "./BrandDropDown"
import SortProducts from "./SortProducts"
import SearchContext, { SearchProvider } from "./SearchContext";

import { SERVER_HOST } from "../config/global_constants"
import axios from "axios"
import {Link} from "react-router-dom";

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            brands: [],
            selectedBrand: 'All Brands',
            categories: [],
            selectedCategory: 'All Categories',
            sortOrder: 'nameAZ',
        }

        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.handleBrandChange = this.handleBrandChange.bind(this)
        this.handleSortChange = this.handleSortChange.bind(this)

    }

    handleAddProduct(newProduct) {
        this.setState({ products: [...this.state.products, newProduct] })
    }

    handleDeleteProduct(id) {
        this.setState(prevState => {
            const updatedProducts = prevState.products.filter(product => product._id !== id)
            return {
                products: updatedProducts,
                originalProducts: updatedProducts
            }
        })
    }

    handleUpdateProduct(updatedProduct) {
        const updatedProducts = this.state.products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
        )
        this.setState({ products: updatedProducts })
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/instruments`)
            .then(res => {
                if ((res.data)) {
                    console.table(res.data)

                    this.originalProducts = res.data
                    const categories = ["All Categories", ...new Set(res.data.map(item => item.category).filter(Boolean))]
                    const brands = ["All Brands", ...new Set(res.data.map(item => item.brand).filter(Boolean))]

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
        this.setState({ selectedCategory: e.target.value })
    }

    handleBrandChange(e) {
        this.setState({ selectedBrand: e.target.value })
    }

    handleSortChange(order) {
        this.setState({ sortOrder: order })
    }

    static contextType = SearchContext

    render() {
        const { products, selectedBrand, selectedCategory, sortOrder  } = this.state
        const { searchQuery } = this.context

        let filteredProducts = products.filter(product => {
            return (
                (searchQuery === '' ||
                    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.price?.toString().includes(searchQuery) ||
                    product.rating?.toString().includes(searchQuery) ||
                    product.reviews?.toString().includes(searchQuery)) &&
                (selectedCategory === "All Categories" || product.category?.toLowerCase() === selectedCategory.toLowerCase()) &&
                (selectedBrand === "All Brands" || product.brand?.toLowerCase() === selectedBrand.toLowerCase())
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
            filteredProducts.sort((a, b) => a.reviews - b.reviews)}
        // } else if (sortOrder === "default") {
        //     filteredProducts = [...products]; // Reset to original order
        // }

        return (
            <div className="product-list">

                <CategoryDropDown categories={this.state.categories} handleCategoryChange={this.handleCategoryChange} selectedCategory={this.state.selectedCategory}  />
                <BrandDropDown brands={this.state.brands} handleBrandChange={this.handleBrandChange} selectedBrand={this.state.selectedBrand}  />

                {/*<AddInstrument onAddProduct={this.handleAddProduct} />*/}
                <div className="add-new-product">
                    <Link className="blue-button" to={"/AddInstrument"}>Add New Instrument</Link>
                </div>
                <div>
                    <SortProducts sortOrder={this.state.sortOrder} handleSortChange={this.handleSortChange} />
                    <div className="grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <Instrument key={product._id} product={product}
                                            onDelete={this.handleDeleteProduct}
                                            onUpdate={this.handleUpdateProduct}/>
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
