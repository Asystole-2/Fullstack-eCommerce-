import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { SANDBOX_CLIENT_ID, SERVER_HOST } from "../config/global_constants";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default class BuyProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToPayPalMessage: false,
            payPalMessageType: null,
            payPalOrderID: null,
            isGuest: !localStorage.getItem("token"),
            guestName: "",
            guestEmail: "",
            showGuestForm: false,
        };
    }

    handleGuestInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    validateGuestInfo = () => {
        const { guestName, guestEmail } = this.state;
        if (!guestName || !guestEmail) {
            alert("Please enter your name and email to proceed as a guest.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
            alert("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: this.props.total,
                        currency_code: "EUR",
                    },
                },
            ],
        });
    };

    onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            if (!this.props.cartItems || !this.props.total) {
                console.error("Cart items or total is missing.");
                alert("Cart items or total is missing. Please check your data.");
                return;
            }

            const userId = localStorage.getItem("userId") || "GUEST_USER_ID";
            const customerName = this.state.isGuest
                ? this.state.guestName
                : localStorage.getItem("name") || "GUEST";
            const customerEmail = this.state.isGuest
                ? this.state.guestEmail
                : localStorage.getItem("email");

            if (this.state.isGuest && !this.validateGuestInfo()) {
                return;
            }

            const saleData = {
                paymentID: data.orderID,
                items: this.props.cartItems.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    name: item.product.name,
                    brand: item.product.brand,
                    category: item.product.category,
                })),
                total: parseFloat(this.props.total),
                userId: userId,
                customerName: customerName,
                customerEmail: customerEmail,
            };

            axios
                .post(`${SERVER_HOST}/sales`, saleData, {
                    headers: {
                        authorization: localStorage.token || "GUEST_TOKEN",
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    if (this.props.onSuccess) this.props.onSuccess();
                    this.setState({
                        payPalMessageType: "success",
                        payPalOrderID: data.orderID,
                        redirectToPayPalMessage: true,
                    });
                })
                .catch((error) => {
                    console.error("Error creating sale:", error.response?.data || error.message);
                    this.setState({
                        payPalMessageType: "error",
                        redirectToPayPalMessage: true,
                    });
                });
        });
    };

    onError = (error) => {
        console.error("PayPal error:", error);
        this.setState({
            payPalMessageType: "error",
            redirectToPayPalMessage: true,
        });
        alert("An error occurred during the payment process. Please try again.");
    };

    onCancel = (data) => {
        console.log("Payment cancelled:", data);
        this.setState({
            payPalMessageType: "cancel",
            redirectToPayPalMessage: true,
        });
    };

    render() {
        const { isGuest, showGuestForm, guestName, guestEmail } = this.state;

        if (this.state.redirectToPayPalMessage) {
            return (
                <Redirect
                    to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}
                />
            );
        }

        return (
            <div>
                {isGuest && !showGuestForm && (
                    <div>
                        <p>You are not logged in. Please provide your details to proceed as a guest.</p>
                        <button onClick={() => this.setState({ showGuestForm: true })}>
                            Enter Guest Info
                        </button>
                    </div>
                )}

                {isGuest && showGuestForm && (
                    <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="guestName"
                                value={guestName}
                                onChange={this.handleGuestInputChange}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="text"
                                name="guestEmail"
                                value={guestEmail}
                                onChange={this.handleGuestInputChange}
                                required
                            />
                        </label>
                        <button onClick={() => this.setState({ showGuestForm: false })}>
                            Cancel
                        </button>
                    </div>
                )}

                {(!isGuest || (isGuest && showGuestForm && guestName && guestEmail)) && (
                    <PayPalScriptProvider
                        key={isGuest ? "guest" : "loggedIn"}
                        options={{
                            "client-id": SANDBOX_CLIENT_ID,
                            currency: "EUR",
                            intent: "capture",
                        }}
                    >
                        <PayPalButtons
                            style={{ layout: "horizontal" }}
                            createOrder={this.createOrder}
                            onApprove={this.onApprove}
                            onError={this.onError}
                            onCancel={this.onCancel}
                        />
                    </PayPalScriptProvider>
                )}
            </div>
        );
    }
}