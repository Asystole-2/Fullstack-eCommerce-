import React, { Component } from "react";


export default class MainPage extends Component {

    render() {
        return (
            <div className="about-page">
                <header>
                    <h1>MyShop</h1>
                </header>

                <h1>About Us</h1>
                <p>Welcome to MyShop! We are passionate about providing the best products at great prices.</p>

                <div className="contact-info">
                    <h3>Contact Us</h3>
                    <p>Email: contact@myshop.com</p>
                    <p>Phone: (123) 456-7890</p>
                </div>

                <div className="mission">
                    <h3>Our Mission</h3>
                    <p>Our goal is to offer the best quality products and exceptional customer service. Thank you for
                        shopping with us!</p>
                </div>
                <footer>
                    <p>&copy; 2025 MyShop. All Rights Reserved.</p>
                </footer>
            </div>

        );
    }
}

