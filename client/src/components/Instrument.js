import React, {Component} from "react"
import { Link } from "react-router-dom";
import InstrumentAPI from "../services/InstrumentAPI";

export default class Instrument extends Component {
    handleStockChange = async (change) => {
        const { product, onUpdate } = this.props;

        if (!product._id || product._id.length !== 24) {
            alert("Invalid instrument ID");
            return;
        }

        if (change < 0 && product.stock + change < 0) {
            alert("Stock cannot be negative");
            return;
        }

        try {
            console.log("Updating stock for ID:", product._id); // Debugging
            const action = change > 0 ? "increase" : "decrease";
            const updatedProduct = await InstrumentAPI.updateStock(product._id, Math.abs(change), action);

            if (!updatedProduct || updatedProduct.stock === undefined) {
                throw new Error("Failed to update stock.");
            }

            onUpdate({ ...product, stock: updatedProduct.stock });

        } catch (error) {
            alert("Failed to update stock: " + (error.message || "Unknown error"));
        }
    };

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
                <p>Price: ${value.toFixed(2)}</p>
                <p>Stock: {product.stock}</p>

                <button onClick={() => this.handleStockChange(-1)} disabled={product.stock <= 0}>
                    Decrease Stock
                </button>
                <button onClick={() => this.handleStockChange(1)}>
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