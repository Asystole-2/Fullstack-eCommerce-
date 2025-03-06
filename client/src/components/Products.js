import React, {Component} from "react"
import Instrument from "./Instrument"
import {SERVER_HOST} from "../config/global_constants"
import axios from "axios"
import {Link} from "react-router-dom"

import CategoryDropDown from "./CategoryDropDown"
import BrandDropDown from "./BrandDropDown"
import SortProducts from "./SortProducts"
import SearchContext, {SearchProvider} from "./SearchContext"
import UsersList from "./UsersLists"

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
        this.handleDelete = this.handleDelete.bind(this)
        this.updateInstrument = this.updateInstrument.bind(this)

        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.handleBrandChange = this.handleBrandChange.bind(this)
        this.handleSortChange = this.handleSortChange.bind(this)
    }

    handleAddProduct = (newProduct) => {
        this.setState({products: [...this.state.products, newProduct]})
    }

    // Handle DELETE request
    handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instrument?")) return

        try {
            const response = await fetch(`${SERVER_HOST}/api/instruments/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                alert("Instrument deleted successfully!")
                if (this.state.products) {
                    this.setState({
                        products: this.state.products.filter(item => item._id !== id)
                    })
                }
            } else {
                alert("Error deleting instrument")
            }
        } catch (error) {
            console.error("Error deleting instrument:", error)
        }
    }

    updateInstrument = (updatedInstrument) => {
        this.setState((prevState) => ({
            products: prevState.products.map(inst =>
                inst._id === updatedInstrument._id ? updatedInstrument : inst
            )
        }))
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
        this.setState({selectedCategory: e.target.value})
    }

    handleBrandChange(e) {
        this.setState({selectedBrand: e.target.value})
    }

    handleSortChange(order) {
        this.setState({sortOrder: order})
    }

    static contextType = SearchContext

    render() {
        const {products, selectedBrand, selectedCategory, sortOrder} = this.state
        const { searchQuery = "" } = this.context || {}

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
            filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        } else if (sortOrder === "nameZA") {
            filteredProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        } else if (sortOrder === "lowToHigh") {
            filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0))
        } else if (sortOrder === "highToLow") {
            filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0))
        } else if (sortOrder === "reviewsHighToLow") {
            filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        } else if (sortOrder === "reviewsLowToHigh") {
            filteredProducts.sort((a, b) => (a.reviews || 0) - (b.reviews || 0))
        }

        const userRole = localStorage.getItem("role")
        return (
            <div className="product-list">

                <CategoryDropDown categories={this.state.categories} handleCategoryChange={this.handleCategoryChange}
                                  selectedCategory={this.state.selectedCategory}/>
                <BrandDropDown brands={this.state.brands} handleBrandChange={this.handleBrandChange}
                               selectedBrand={this.state.selectedBrand}/>

                {/*<AddInstrument onAddProduct={this.handleAddProduct} />*/}
                {userRole === "admin" && (
                    <div className="add-new-product">
                        <Link className="blue-button" to={"/AddInstrument"}>Add New Instrument</Link>
                    </div>
                )}
                <div>
                    <SortProducts sortOrder={this.state.sortOrder} handleSortChange={this.handleSortChange}/>
                    <div className="grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (

                                <Instrument
                                    key={product._id}
                                    product={product}
                                    onDelete={this.handleDelete}
                                    onUpdate={this.updateInstrument}
                                />
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>
                </div>
                {userRole === "admin" && (
                    <UsersList/>
                )}
            </div>
        )
    }
}



