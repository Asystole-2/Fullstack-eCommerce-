import React from 'react';
import Navbar from "./Navbar";
import { Link, Redirect } from "react-router-dom";
import LinkInClass from "./LinkInClass";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",

            isRegistered: false,
            errors: ""
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();


        // Check password confirmation
        if (this.state.password !== this.state.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        axios.post(`${SERVER_HOST}/users/register`, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                if (res.data && res.data.errorMessage) {
                    console.log(res.data.errorMessage);
                    this.setState({ errors: res.data.errorMessage });
                } else {
                    console.log("Record added");
                    this.setState({ isRegistered: true });
                }
            })
            .catch(error => {
                console.error("Registration error:", error.response?.data || error.message);
                this.setState({ errors: "Registration failed. Please try again." });
            });
    };

    render() {
        if (this.state.isRegistered) {
            return <Redirect to="/MainPage" />;
        }

        return (
            <div>
                <div className="register">
                    <div className="register-container">
                        <div className="input-group">
                            <h2>Register</h2>
                            <form className="form-container" onSubmit={this.handleSubmit}>
                                <label>
                                    Name*
                                    <input
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Email*
                                    <input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Password*
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Confirm Password*
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={this.state.confirmPassword}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </label>

                                {this.state.errors && <p style={{ color: "red" }}>{this.state.errors}</p>}

                                <button type="submit" className="green-button">Register New User</button>
                                <Link className="red-button" to={"/Login"}>Cancel</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
