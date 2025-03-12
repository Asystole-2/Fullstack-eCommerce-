import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {SERVER_HOST} from "../config/global_constants";
import "../scss/home.css";

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };
    }

    componentDidMount() {
        axios
            .get(`${SERVER_HOST}/instruments`)
            .then((res) => {
                if (res.data) {
                    const filteredProducts = res.data.filter(
                        (product) => product.reviews > 28
                    );
                    this.setState({products: filteredProducts});
                } else {
                    console.log("No products found");
                }
            })
            .catch((error) => {
                console.error("Error fetching instruments:", error);
            });
    }

    render() {
        const {products} = this.state;

        return (
            <div className="home-page">
                {/* Background Video */}
                <div className="background-video">
                    <video
                        className="background-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/videos/background.mp4" type="video/mp4"/>
                    </video>

                    <div className="shop-button-container">
                        <Link to="/MainPage" className="shop-button">
                            Shop Now
                        </Link>
                    </div>
                </div>

                {/* Content Below the Video */}
                <div className="content">
                    <h1>Welcome to MyShop</h1>
                    <p>Explore some of our products:</p>

                    {/* Instrument Cards */}
                    <div className="product-list2">
                        {this.state.products.length > 0 ? (
                            this.state.products.map((product) => (
                                < div className="product-card2">
                                <div key={product._id} className="product-card">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0]} alt={product.name} />
                                    ) : (
                                        <div className="no-image">No Image Available</div>
                                    )}
                                    <h2>{product.name}</h2>
                                    <p>Brand: {product.brand}</p>
                                    <p>Rating: {product.rating}</p>
                                    <p>Reviews: {product.reviews}</p></div>
                                </div>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>

                    {/* Material Acquisition Sections */}
                    <div className="material-sections">
                        <h2>How We Acquire Materials for Our Instruments</h2>
                        <div className="material-cards">
                            {/* Wood */}
                            <div className="material-card">
                                <h3>Wood</h3>
                                <p>
                                    We source high-quality wood from sustainable forests. Our
                                    suppliers ensure that the wood is ethically harvested and
                                    treated to enhance durability and sound quality.
                                </p>
                            </div>

                            {/* Metal */}
                            <div className="material-card">
                                <h3>Metal</h3>
                                <p>
                                    The metal components of our instruments are made from
                                    premium-grade alloys. These materials are carefully selected
                                    for their strength, resistance to corrosion, and ability to
                                    produce rich tones.
                                </p>
                            </div>

                            {/* Strings */}
                            <div className="material-card">
                                <h3>Strings</h3>
                                <p>
                                    Our strings are crafted from high-tensile materials like
                                    steel, nylon, and gut. Each type of string is designed to
                                    deliver optimal performance and longevity.
                                </p>
                            </div>

                            {/* Electronics */}
                            <div className="material-card">
                                <h3>Electronics</h3>
                                <p>
                                    For electric instruments, we use state-of-the-art
                                    electronics. These components are rigorously tested to ensure
                                    they meet our high standards for sound quality and
                                    reliability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}