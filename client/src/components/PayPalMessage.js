import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

export default class PayPalMessage extends Component {
    static messageType = {
        SUCCESS: 'success',
        ERROR: 'error',
        CANCEL: 'cancel'
    }

    constructor(props) {
        super(props)
        this.state = {
            heading: '',
            message: '',
            buttonColour: 'red-button',
            redirectToProducts: false
        }
    }

    componentDidMount() {
        const { messageType } = this.props.match.params

        switch (messageType) {
            case PayPalMessage.messageType.SUCCESS:
                this.setState({
                    heading: 'Payment Successful',
                    message: 'Thank you for your purchase! Your payment has been processed successfully.',
                    buttonColour: 'green-button'
                })
                break
            case PayPalMessage.messageType.ERROR:
                this.setState({
                    heading: 'Payment Error',
                    message: 'We encountered an issue processing your payment. Please try again or contact support.',
                    buttonColour: 'red-button'
                })
                break
            case PayPalMessage.messageType.CANCEL:
                this.setState({
                    heading: 'Payment Cancelled',
                    message: 'Your payment was cancelled. No charges have been made to your account.',
                    buttonColour: 'yellow-button'
                })
                break
            default:
                this.setState({ redirectToProducts: true })
        }
    }

    render() {
        const { messageType, payPalPaymentID } = this.props.match.params

        if (this.state.redirectToProducts) {
            return <Redirect to="/Products" />
        }

        return (
            <div className={`payPalMessage ${messageType}`}>
                <h3>{this.state.heading}</h3>
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