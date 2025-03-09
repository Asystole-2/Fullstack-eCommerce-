import React, { Component } from "react"
import axios from "axios"
import { Redirect } from "react-router-dom"
import { SANDBOX_CLIENT_ID, SERVER_HOST } from "../config/global_constants"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"

export default class BuyProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToPayPalMessage: false,
            payPalMessageType: null,
            payPalOrderID: null,
            isGuest: !localStorage.getItem("userId"), // Check if user is logged in
            guestName: "",
            guestEmail: "",
            showGuestForm: false, // Toggle guest form visibility
        }
    }

    // Handle guest info input changes
    handleGuestInputChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    // Validate guest info
    validateGuestInfo = () => {
        const { guestName, guestEmail } = this.state
        if (!guestName || !guestEmail) {
            alert("Please enter your name and email to proceed as a guest.")
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
            alert("Please enter a valid email address.")
            return false
        }
        return true
    }

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
        })
    }

    onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            // Validate cartItems and total
            if (!this.props.cartItems || !this.props.total) {
                console.error("Cart items or total is missing.")
                alert("Cart items or total is missing. Please check your data.")
                return
            }

            // Retrieve user data
            const userId = localStorage.getItem("userId") || "GUEST_USER_ID" // Fallback for guests
            const customerName = this.state.isGuest
                ? this.state.guestName
                : localStorage.getItem("name") || "GUEST"
            const customerEmail = this.state.isGuest
                ? this.state.guestEmail
                : localStorage.getItem("email")

            // Validate guest info if user is not logged in
            if (this.state.isGuest && !this.validateGuestInfo()) {
                return
            }

            // Prepare saleData object with instrument details
            const saleData = {
                paymentID: data.orderID,
                items: this.props.cartItems.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    name: item.product.name, // Include instrument name
                    brand: item.product.brand, // Include instrument brand
                    category: item.product.category, // Include instrument category
                })),
                total: parseFloat(this.props.total), // Ensure total is a number
                userId: userId,
                customerName: customerName,
                customerEmail: customerEmail,
            }

            // Validate saleData
            if (
                !saleData.paymentID ||
                !saleData.items ||
                !saleData.total ||
                !saleData.userId ||
                !saleData.customerName ||
                !saleData.customerEmail
            ) {
                console.error("Missing required fields in saleData:", saleData)
                alert("Missing required fields. Please check your data.")
                retur
            }

            // Log the request payload for debugging
            console.log("Sending saleData to server:", saleData)

            // Send saleData to the server
            axios
                .post(`${SERVER_HOST}/sales`, saleData, {
                    headers: {
                        authorization: localStorage.token || "GUEST_TOKEN", // Fallback for guests
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    if (this.props.onSuccess) this.props.onSuccess()
                    this.setState({
                        payPalMessageType: "success",
                        payPalOrderID: data.orderID,
                        redirectToPayPalMessage: true,
                    })
                })
                .catch((error) => {
                    console.error("Error creating sale:", error.response?.data || error.message)
                    this.setState({
                        payPalMessageType: "error",
                        redirectToPayPalMessage: true,
                    })
                })
        })
    }

    onError = (error) => {
        console.error("PayPal error:", error)
        this.setState({
            payPalMessageType: "error",
            redirectToPayPalMessage: true,
        })
    }

    onCancel = (data) => {
        console.log("Payment cancelled:", data)
        this.setState({
            payPalMessageType: "cancel",
            redirectToPayPalMessage: true,
        })
    }

    render() {
        const { isGuest, showGuestForm, guestName, guestEmail } = this.state

        // Redirect to PayPalMessage if payment is processed
        if (this.state.redirectToPayPalMessage) {
            return (
                <Redirect
                    to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}
                />
            )
        }

        return (
            <div>
                {/* Guest Info Form */}
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
                                type="email"
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

                {/* PayPal Buttons */}
                {(!isGuest || (isGuest && showGuestForm && guestName && guestEmail)) && (
                    <PayPalScriptProvider
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
        )
    }
}