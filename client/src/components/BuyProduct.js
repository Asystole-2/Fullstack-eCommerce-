import React, {Component} from "react"
import axios from "axios"
import {Redirect} from "react-router-dom"
import {SANDBOX_CLIENT_ID, SERVER_HOST} from "../config/global_constants"
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js"

export default class BuyProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToPayPalMessage: false,
            payPalMessageType: null,
            payPalOrderID: null
        }
    }

    createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: this.props.total,
                    currency_code: "EUR"
                }
            }]
        })
    }

    onApprove = (paymentData) => {
        const saleData = {
            paymentID: paymentData.orderID,
            items: this.props.cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: this.props.total,
            userId: localStorage.userId,
            customerName: localStorage.name,
            customerEmail: localStorage.email
        }

        axios.post(`${SERVER_HOST}/sales`, saleData, {
            headers: {
                "authorization": localStorage.token,
                "Content-type": "application/json"
            }
        }).then(res => {
            if (this.props.onSuccess) this.props.onSuccess()
            this.setState({
                payPalMessageType: "success",  // Use string directly
                payPalOrderID: paymentData.orderID,
                redirectToPayPalMessage: true
            })
        }).catch(error => {
            this.setState({
                payPalMessageType: "error",  // Use string directly
                redirectToPayPalMessage: true
            })
        })
    }

    onError = errorData => {
        this.setState({
            payPalMessageType: "error",  // Use string directly
            redirectToPayPalMessage: true
        })
    }

    onCancel = cancelData => {
        this.setState({
            payPalMessageType: "cancel",  // Use string directly
            redirectToPayPalMessage: true
        })
    }

    render() {
        return (
            <div>
                {this.state.redirectToPayPalMessage &&
                    <Redirect to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}/>}

                <PayPalScriptProvider
                    options={{
                        "currency": "EUR",
                        "clientId": SANDBOX_CLIENT_ID,
                        components: "buttons",
                        intent: "capture"
                    }}
                >
                    <PayPalButtons
                        style={{layout: "horizontal"}}
                        createOrder={this.createOrder}
                        onApprove={this.onApprove}
                        onError={this.onError}
                        onCancel={this.onCancel}
                    />
                </PayPalScriptProvider>
            </div>
        )
    }
}