import React, {Component} from "react"
export default class CategoryDropDown extends Component {

    render() {

        return (
            <select name="category" onChange={this.props.handleCategoryChange}>
                {this.props.categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
        )

    }
}