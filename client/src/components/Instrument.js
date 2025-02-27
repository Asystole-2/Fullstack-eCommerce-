import React, {Component} from "react"
import {Link} from "react-router-dom";
import {ACCESS_LEVEL_ADMIN} from "../config/global_constants";

export default class Instrument extends Component {
    handleDeleteClick = () => {
        const {product, onDelete} = this.props
        onDelete(product._id)
    }

    render() {
        const {product, onUpdate} = this.props
        const value = product.price || 0
        return (
            <div className="product-card">
                <img src={product.image} alt={product.name}/>
                <h2>{product.name}</h2>
                <p>Brand: {product.brand}</p>
                <p>{product.description}</p>
                <p>Rating: {product.rating}</p>
                <p>Reviews: {product.reviews}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Price: ${value.toFixed(2)}</p>
                <p>Stock: {product.stock}</p>

                {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <button onClick={() => onUpdate({...product, stock: product.stock - 1})}>
                    Decrease Stock
                </button> : null}
                {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <button onClick={() => onUpdate({...product, stock: product.stock + 1})}>
                    Increase Stock
                </button> : null}
                {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <button onClick={this.handleDeleteClick}>Delete</button> : null}
                {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <Link to={"/EditInstrument/" + product._id}>Edit</Link> : null}
            </div>
        )
    }
}