import React, {Component} from "react";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import {SERVER_HOST} from "../config/global_constants";
import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_USER, ACCESS_LEVEL_GUEST} from "../config/global_constants";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
            error: '',
            isLoggedIn: false,
            redirectURL: "/MainPage",
        }
    }

    handleLogin = async (e) => {
        e.preventDefault();
        console.log('Logging in with:', this.state.loginEmail, this.state.loginPassword);

        try {
            const res = await axios.post(`${SERVER_HOST}/users/login`, {
                email: this.state.loginEmail,
                password: this.state.loginPassword
            });

            if (!res.data || !res.data.role) {
                this.setState({ error: "Login failed. No role found in response." });
                return;
            }

            // Convert role string ("user"/"admin") to numerical access level
            let accessLevel = ACCESS_LEVEL_GUEST;
            if (res.data.role === "user") {
                accessLevel = ACCESS_LEVEL_USER;
            } else if (res.data.role === "admin") {
                accessLevel = ACCESS_LEVEL_ADMIN;
            }

            // Store access level in sessionStorage
            sessionStorage.setItem("accessLevel", accessLevel);
            sessionStorage.setItem("token", res.data.token); // Store token for authentication

            alert('Login successful');
            window.location.href = "/MainPage";
            this.setState({ isLoggedIn: true, redirectURL: res.data.redirectURL || "/MainPage" });

        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            this.setState({ error: error.response?.data?.error || "Login failed. Please check your credentials." });
        }
    };


    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to={this.state.redirectURL}/>;
        }
        return (
            <div style = {{zIndex : 1000}}>
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
                                        onChange={e => this.setState({loginEmail: e.target.value})}
                                        required
                                    />
                                </label>
                                <label>
                                    Password *
                                    <input
                                        type="password"
                                        value={this.state.loginPassword}
                                        onChange={e => this.setState({loginPassword: e.target.value})}
                                        required
                                    />
                                </label>
                                <div>
                                    <input type="checkbox"/> Remember Me
                                </div>
                                <button type="submit">Log in</button>
                                <a href="#">Lost your password?</a>
                            </div>
                        </form>


                        {/* Additional Links */}
                        <div style={{marginLeft: 20}}>
                            <p>Don't have an account?</p>
                            <Link to="/Register">Register</Link>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;