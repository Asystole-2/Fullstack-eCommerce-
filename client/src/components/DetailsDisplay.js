import React, { Component } from "react";
import PurchaseDetails from "./PurchaseDetails";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";

export default class DetailsDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAllPurchases: false, // Toggle to show all purchases
        };
    }

    // Toggle between showing all purchases and user-specific purchases
    toggleShowAllPurchases = () => {
        this.setState((prevState) => ({
            showAllPurchases: !prevState.showAllPurchases,
        }));
    };

    render() {
        const { showAllPurchases } = this.state;
        const isAdmin = localStorage.getItem("accessLevel") === ACCESS_LEVEL_ADMIN;

        return (
            <div>
                <h2>Purchase Details</h2>
                {isAdmin && (
                    <button onClick={this.toggleShowAllPurchases}>
                        {showAllPurchases ? "Show My Purchases" : "Show All Purchases"}
                    </button>
                )}
                <PurchaseDetails showAllPurchases={showAllPurchases} />
            </div>
        );
    }
}