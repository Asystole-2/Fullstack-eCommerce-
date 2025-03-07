import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

export default class PayPalMessage extends Component {
    static messageType = {
        SUCCESS: "success",
        ERROR: "error",
        CANCEL: "cancel"
    }

    constructor(props) {
        super(props)
        this.state = {
            heading: "",
            message: "",
            buttonColour: "red-button",
            redirectToProducts: false,
        }
    }

    componentDidMount() {
        const {messageType} = this.props.match.params

        switch (messageType) {
            case PayPalMessage.messageType.SUCCESS:
                this.setState({
                    heading: "Payment Confirmation",
                    message: "Your transaction was completed successfully.",
                    buttonColour: "green-button",
                })
                break
            case PayPalMessage.messageType.CANCEL:
                this.setState({
                    heading: "Transaction Cancelled",
                    message: "You cancelled the transaction. No payment was processed.",
                })
                break
            case PayPalMessage.messageType.ERROR:
                this.setState({
                    heading: "Transaction Error",
                    message: "An error occurred during payment processing. Please try again.",
                })
                break
            default:
                console.log("Invalid message type received")
                this.setState({redirectToProducts: true})
        }
    }

    render() {
        const {messageType, payPalPaymentID} = this.props.match.params

        if (this.state.redirectToProducts) {
            return <Redirect to="/Products"/>
        }

        return (
            <div className={`payPalMessage ${this.props.match.params.messageType}`}><h3>{this.state.heading}</h3>
                <p>{this.state.message}</p>

                {messageType === PayPalMessage.messageType.SUCCESS && (
                    <p>
                        Payment ID: <span className="payment-id">{payPalPaymentID}</span>
                    </p>
                )}

                <div className="action-button">
                    <Link className={this.state.buttonColour} to="/Products">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }
}