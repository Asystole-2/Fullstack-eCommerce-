import React, {Component} from "react"
import AddInstrument from "./AddInstrument"
import Instrument from "./Instrument"
import CategoryDropDown from "./CategoryDropDown"
import BrandDropDown from "./BrandDropDown";

import {SERVER_HOST} from "../config/global_constants"
import axios from "axios"

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            searchTerm: '',
            brands: [],
            selectedBrand: '',
            categories: [],
            selectedCategory: 'All',
            selectedProducts: 'All',

        }

        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.handleBrandChange = this.handleBrandChange.bind(this)
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
    // handleCategoryChange = (e) => {
    //     let selectedCategory =  e.target.value
    //     let selectedProducts = [...this.state.products]
    //
    //     if (selectedCategory !== "All") {
    //         selectedProducts = selectedProducts.filter(products => products.includes(selectedCategory))
    //     }
    //     this.setState({selectedCategory, selectedProducts})
    // }
    //
    // handleBrandChange = (e) => {
    //     let selectedBrand =  e.target.value
    //     let selectedProducts = [...this.state.products]
    //
    //     if (selectedBrand !== "All") {
    //         selectedProducts = selectedProducts.filter(products => products.includes(selectedBrand))
    //     }
    //     this.setState({selectedBrand, selectedProducts})
    // }

    handleCategoryChange(event) {
        this.setState({selectedCategory: event.target.value})
    }

    handleBrandChange(event) {
        this.setState({selectedBrand: event.target.value})
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/instruments`)
            .then(res => {

                if (res.data) {
                    console.table(res.data)

                    const categories = ["All", ...new Set(res.data.map(item => item.category).filter(Boolean))].sort()
                    const brands = ["All", ...new Set(res.data.map(item => item.brand).filter(Boolean))].sort()

                    this.setState({

                        products: res.data,
                        categories,
                        brands,

                    })
                } else {
                    console.log("Record not found")
                }
            })
            .catch(error => console.error("Error fetching instruments:", error));

    }

    render() {
        const {searchTerm, products, selectedBrand, selectedCategory} = this.state

        const filteredProducts = products.filter(product => {
            return (
                ( product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.price?.toString().includes(searchTerm) ||
                product.rating?.toString().includes(searchTerm) ||
                product.reviews?.toString().includes(searchTerm)) &&
                product.category?.toLowerCase().includes(selectedCategory.toLowerCase()) &&
                product.brand?.toLowerCase().includes(selectedBrand.toLowerCase()) )

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
                <CategoryDropDown categories={this.state.categories} handleCategoryChange={this.handleCategoryChange}/>
                <BrandDropDown brands={this.state.brands} handleCategoryChange={this.handleCategoryChange}/>

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
