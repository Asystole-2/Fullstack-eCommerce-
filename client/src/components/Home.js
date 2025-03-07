import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";
import Instrument from "./Instrument";
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        }
    }

    componentDidMount() {
        axios
            .get(`${SERVER_HOST}/instruments`)
            .then((res) => {
                if (res.data) {
                    const filteredProducts = res.data.filter(
                        (product) => product.reviews > 28
                    )
                    this.setState({ products: filteredProducts })
                } else {
                    console.log("No products found")
                }
            })
            .catch((error) => {
                console.error("Error fetching instruments:", error)
            })
    }

    render() {
        return (
            <div className="home-page">
                <div className="background-image">
                <h1>Welcome to MyShop</h1>
                <p>Explore some of our products:</p>
            </div>
                <div className="product-list">
                    {this.state.products.length > 0 ? (
                        this.state.products.map((product) => (
                            <div key={product._id} className="product-card">
                                {/* Using the Instrument component to display the product details */}
                                <Instrument product={product} onDelete={() => {}} />
                            </div>
                        ))
                    ) : (
                        <p>No products with more than 15 reviews found.</p>
                    )}
                </div>
                <Link to="/MainPage" className="shop-link">
                    See more products
                </Link>
            </div>
        );
    }
}