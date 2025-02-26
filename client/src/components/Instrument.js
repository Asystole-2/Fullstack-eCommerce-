import React, {Component} from "react"
import {Link} from "react-router-dom";

export default class Instrument extends Component {

    render() {
        const {product, onUpdate, onDelete} = this.props
        const value = product.price || 0
        return (
            <div className="product-card">
                <img src={product.image} alt={product.name}/>
                <h2>{product.name}</h2>
                <p>Brand: {product.brand}</p>
                <p>{product.description}</p>
                <p>Rating: {product.rating}</p>
                <p>Reviews: {product.reviews}</p>
                {/*<p>Price: ${product.price.toFixed(2)}</p>*/}
                <p>Price: ${value.toFixed(2)}</p>
                <p>Stock: {product.stock}</p>

                <button onClick={() => onUpdate({...product, stock: product.stock - 1})}>
                    Decrease Stock
                </button>
                <button onClick={() => onUpdate({...product, stock: product.stock + 1})}>
                    Increase Stock
                </button>
                <button onClick={() => onDelete(product._id)}>Delete</button>
                <button>
                    <Link to={"/EditInstrument/" + product._id}>Edit</Link>
                </button>
            </div>
        )
    }
}