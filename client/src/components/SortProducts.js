import React, { Component } from "react";

export default class SortProducts extends Component {
    render() {
        return (
            <div>
                <h4>Sort Products</h4>
                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="nameAZ"
                        checked={this.props.sortOrder === "nameAZ"}
                        onChange={() => this.props.handleSortChange("nameAZ")}
                    />
                    <label>Name: A-Z</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="nameZA"
                        checked={this.props.sortOrder === "nameZA"}
                        onChange={() => this.props.handleSortChange("nameZA")}
                    />
                    <label>Name: Z-A</label>
                </div>

                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="lowToHigh"
                        checked={this.props.sortOrder === "lowToHigh"}
                        onChange={() => this.props.handleSortChange("lowToHigh")}
                    />
                    <label>Price: Low to High</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="highToLow"
                        checked={this.props.sortOrder === "highToLow"}
                        onChange={() => this.props.handleSortChange("highToLow")}
                    />
                    <label>Price: High to Low</label>
                </div>

                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="reviewsHighToLow"
                        checked={this.props.sortOrder === "reviewsHighToLow"}
                        onChange={() => this.props.handleSortChange("reviewsHighToLow")}
                    />
                    <label>Reviews: Most to Least</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="reviewsLowToHigh"
                        checked={this.props.sortOrder === "reviewsLowToHigh"}
                        onChange={() => this.props.handleSortChange("reviewsLowToHigh")}
                    />
                    <label>Reviews: Least to Most</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="sortOption"
                        value="default"
                        checked={this.props.sortOrder === "default"}
                        onChange={() => this.props.handleSortChange("default")}
                    />
                    <label>No Sorting</label>
                </div>

            </div>
        );
    }
}
