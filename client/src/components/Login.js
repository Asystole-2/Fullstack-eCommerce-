import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
            error: '',
            isLoggedIn: false,
            redirectURL: "/MainPage",
        };
    }

    // Handle Login
    handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login with:', this.state.loginEmail, this.state.loginPassword);
        console.log("User role: ", this.state.accessLevel); // Add this before sending response

        try {
            const res = await axios.post(`${SERVER_HOST}/users/login`, {
                email: this.state.loginEmail,
                password: this.state.loginPassword
            });

            // Handle successful login
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                sessionStorage.setItem('token', res.data.token);
                localStorage.setItem('profilePhoto', res.data.profilePhoto);
                this.setState({ isLoggedIn: true });
                console.log("User logged in");
            }

            localStorage.setItem("name", res.data.name);
            localStorage.setItem("accessLevel", res.data.accessLevel);
            localStorage.setItem("token", res.data.token);

        } catch (error) {
            console.error('Login error:', error);
            this.setState({ error: "Login failed. Please check your credentials." });
        }
    }

    // Logout Function
    handleLogout = () => {
        localStorage.clear(); // Clear storage on logout
        sessionStorage.clear();
        this.setState({ isLoggedIn: false }); // Update state
    }

    componentDidMount() {
        // Check if user is logged in when component mounts
        const token = localStorage.getItem('token');
        if (token) {
            this.setState({ isLoggedIn: true });
        }
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to={this.state.redirectURL} />;
        }

        return (
            <div>
                <div className="login">
                    <div className="login-container">
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
                                <button type="submit">Log in</button>
                            </div>
                        </form>
                        {this.state.error && <p style={{color: "red"}}>{this.state.error}</p>}

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

                {/* Show Logout Button if Logged In */}
                {this.state.isLoggedIn && (
                    <button onClick={this.handleLogout}>Logout</button>
                )}
            </div>
        );
    }
}

export default Login;
