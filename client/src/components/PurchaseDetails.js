import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import "../css/PurchaseDetails.css"; // Import the CSS file

export default class PurchaseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchases: [], // Stores fetched purchase details
            loading: false, // Tracks loading state
            error: null, // Stores error messages
            isAdmin: localStorage.getItem("email") === "admin@example.com", // Validate admin by email
        };
    }

    componentDidMount() {
        // Fetch purchase history when the component mounts
        this.fetchPurchaseHistory();
    }

    // Fetch purchase history based on user role
    fetchPurchaseHistory = async () => {
        const userId = localStorage.getItem("userId");
        const isAdmin = this.state.isAdmin;

        if (!userId && !isAdmin) {
            this.setState({ error: "User ID not found." });
            return;
        }

        this.setState({ loading: true, error: null });

        const endpoint = isAdmin
            ? `${SERVER_HOST}/sales` // Fetch all sales for admin
            : `${SERVER_HOST}/sales/user/${userId}`; // Fetch user-specific sales

        try {
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${localStorage.token}` }, // Include authorization token
            });
            this.setState({ purchases: response.data.data, loading: false });
        } catch (error) {
            console.error("Error fetching purchase history:", error);
            this.setState({
                error: "Failed to fetch purchase history.",
                loading: false,
            });
        }
    };

    render() {
        const { purchases, loading, error, isAdmin } = this.state;

        return (
            <div>
                {loading && <p className="loading-message">Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {purchases.length > 0 ? (
                    <table className="purchase-table">
                        <thead>
                        <tr>
                            <th>Date</th> {/* New column for purchase date */}
                            <th>Payment ID</th>
                            <th>Total</th>
                            {isAdmin && (
                                <>
                                    <th>Customer Name</th>
                                    <th>Customer Email</th>
                                </>
                            )}
                            <th>Items</th>
                        </tr>
                        </thead>
                        <tbody>
                        {purchases.map((purchase, index) => (
                            <tr key={index}>
                                <td>{new Date(purchase.createdAt).toLocaleDateString()}</td> {/* Display purchase date */}
                                <td>{purchase.paypalPaymentID}</td>
                                <td>${purchase.total}</td>
                                {isAdmin && (
                                    <>
                                        <td>{purchase.customerName}</td>
                                        <td>{purchase.customerEmail}</td>
                                    </>
                                )}
                                <td>
                                    <table className="items-table">
                                        <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Brand</th>
                                            <th>Category</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {purchase.items.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td>{item.name}</td>
                                                <td>{item.brand}</td>
                                                <td>{item.category}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p className="error-message">No purchases found.</p>
                )}
            </div>
        );
    }
}