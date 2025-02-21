import React, {Component} from "react"
import {Link} from "react-router-dom";

export default class Instrument extends Component {
    handleDeleteClick = () => {
        const {product, onDelete} = this.props
        onDelete(product._id)
    }

    render() {
        const {product, onUpdate} = this.props
        return (
            <div className="product-card">
                <img src={product.image} alt={product.name}/>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Stock: {product.stock}</p>

                <button onClick={() => onUpdate({...product, stock: product.stock - 1})}>
                    Decrease Stock
                </button>
                <button onClick={() => onUpdate({...product, stock: product.stock + 1})}>
                    Increase Stock
                </button>
                <button onClick={this.handleDeleteClick}>Delete</button>
                <Link to={"/EditInstrument/" + product._id}>Edit</Link>
            </div>
        )
    }
}