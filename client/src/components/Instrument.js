import React, {Component} from "react"
import {Link} from "react-router-dom";

export default class Instrument extends Component {

    handleStockChange = async (change) => {
        const { product, onUpdate } = this.props;
        const newStock = product.stock + change;

        if (newStock < 0) return; // Prevent negative stock

        try {
            // Define the endpoint dynamically based on whether we're increasing or decreasing stock
            const endpoint = change > 0
                ? `http://localhost:4000/instruments/increase/${product._id}` // Increase stock
                : `http://localhost:4000/instruments/decrease/${product._id}`; // Decrease stock

            // Make a PUT request with the amount in the body
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Math.abs(change) }) // Send positive amount for both increase and decrease
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Stock update failed");
            }

            // Parse and update the product stock if the update was successful
            const updatedProduct = await response.json();
            onUpdate({ ...product, stock: updatedProduct.stock }); // Update product UI

        } catch (error) {
            console.error("Stock Update Error:", error.message);
            alert("Failed to update stock: " + error.message);
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
                {/*<p>Price: ${product.price.toFixed(2)}</p>*/}
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