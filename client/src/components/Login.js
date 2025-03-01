import React, { Component } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
        };
    }

    handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login with:', this.state.loginEmail, this.state.loginPassword);

        try {
            const res = await axios.post(`${SERVER_HOST}/users/login`, {
                email: this.state.loginEmail,
                password: this.state.loginPassword
            });

            if (res.data.errorMessage) {
                this.setState({ errors: { general: res.data.errorMessage } });
            } else {
                localStorage.setItem('token', res.data.token);
                alert('Login successful');
                this.setState({ isLoggedIn: true });
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            this.setState({ errors: { general: error.response?.data?.error || "Login failed. Please check your credentials." } });
        }
    };




    render() {
        if (this.state.isLoggedIn)
        {
            return <Redirect to="/MainPage"/>;
        }
        return (
            <div>
                <Navbar />
                <div className="login">
                    <div className="login-container">
                        {/* Login Form */}
                        <form onSubmit={this.handleLogin}>
                            <h2>Login</h2>
                            <div className="input-group">
                                <label>
                                    Email Address *
                                    <input
                                        type="email"
                                        value={this.state.loginEmail}
                                        onChange={e => this.setState({ loginEmail: e.target.value })}
                                        required
                                    />
                                </label>
                                <label>
                                    Password *
                                    <input
                                        type="password"
                                        value={this.state.loginPassword}
                                        onChange={e => this.setState({ loginPassword: e.target.value })}
                                        required
                                    />
                                </label>
                                <div>
                                    <input type="checkbox" /> Remember Me
                                </div>
                                <button type="submit">Log in</button>
                                <a href="#">Lost your password?</a>
                            </div>
                        </form>

                        {/* Additional Links */}
                        <div style={{ marginLeft: 20 }}>
                            <p>Don't have an account?</p>
                            <Link to="/Register">Register</Link>
                            <br /><br />
                            <p>Or, sign in as Admin</p>
                            <Link to="/AdminLogin">Admin Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;