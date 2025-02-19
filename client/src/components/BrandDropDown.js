import React, {Component} from "react"
export default class BrandDropDown extends Component {

    render() {

        return (
            <select name="brand" onChange={this.props.handleBrandChange}>
                {this.props.brands.map((brand, index) => (
                    <option key={index} value={brand}>{brand}</option>
                ))}
            </select>
        )

    }
}