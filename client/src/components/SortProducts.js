// SortProducts.js
import React, { Component } from "react";

export default class SortProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownOpen: false, // Controls dropdown visibility
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    toggleDropdown = () => {
        this.setState((prevState) => ({
            isDropdownOpen: !prevState.isDropdownOpen,
        }));
    };

    render() {
        return (
            <div className="dropdown">
                <button className="dropdown-toggle" onClick={this.toggleDropdown}>
                    Sort Products
                </button>
                {this.state.isDropdownOpen && (
                    <div className="dropdown-menu">
                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="nameAZ"
                                checked={this.props.sortOrder === "nameAZ"}
                                onChange={() => this.props.handleSortChange("nameAZ")}
                            />
                            <span>Name: A-Z</span>
                        </label>

                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="nameZA"
                                checked={this.props.sortOrder === "nameZA"}
                                onChange={() => this.props.handleSortChange("nameZA")}
                            />
                            <span>Name: Z-A</span>
                        </label>

                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="lowToHigh"
                                checked={this.props.sortOrder === "lowToHigh"}
                                onChange={() => this.props.handleSortChange("lowToHigh")}
                            />
                            <span>Price: Low to High</span>
                        </label>

                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="highToLow"
                                checked={this.props.sortOrder === "highToLow"}
                                onChange={() => this.props.handleSortChange("highToLow")}
                            />
                            <span>Price: High to Low</span>
                        </label>

                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="reviewsHighToLow"
                                checked={this.props.sortOrder === "reviewsHighToLow"}
                                onChange={() => this.props.handleSortChange("reviewsHighToLow")}
                            />
                            <span>Reviews: Most to Least</span>
                        </label>

                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="reviewsLowToHigh"
                                checked={this.props.sortOrder === "reviewsLowToHigh"}
                                onChange={() => this.props.handleSortChange("reviewsLowToHigh")}
                            />
                            <span>Reviews: Least to Most</span>
                        </label>

                        <label className="dropdown-option">
                            <input
                                type="radio"
                                name="sortOption"
                                value="default"
                                checked={this.props.sortOrder === "default"}
                                onChange={() => this.props.handleSortChange("default")}
                            />
                            <span>No Sorting</span>
                        </label>
                    </div>
                )}
            </div>
        );
    }
}