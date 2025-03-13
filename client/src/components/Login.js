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

    handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${SERVER_HOST}/users/login`, {
                email: this.state.loginEmail,
                password: this.state.loginPassword
            });

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                sessionStorage.setItem('token', res.data.token);
                localStorage.setItem("name", res.data.name);
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("accessLevel", res.data.accessLevel);
                sessionStorage.setItem("accessLevel", res.data.accessLevel);

                this.setState({ isLoggedIn: true, error: '' });
                window.location.href = "/MainPage";
            } else {
                this.setState({ error: "Invalid response from server." });
            }
        } catch (error) {
            console.error('Login error:', error);
            this.setState({ error: "Your password or email is incorrect" });
        }
    }

    handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        this.setState({ isLoggedIn: false });
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const accessLevel = parseInt(localStorage.getItem('accessLevel')) || 0;

        if (token && accessLevel > 0) {
            this.setState({ isLoggedIn: true });
        } else {
            localStorage.clear();
            sessionStorage.clear();
            this.setState({ isLoggedIn: false });
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
                        {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}

                        <div style={{ marginLeft: 20 }}>
                            <p>Don't have an account?</p>
                            <Link to="/Register">Register</Link>
                            <br/>
                        </div>
                    </div>
                </div>

                {this.state.isLoggedIn && (
                    <button onClick={this.handleLogout}>Logout</button>
                )}
            </div>
        );
    }
}

export default Login;
