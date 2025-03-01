import React, {Component} from "react"
import Navbar from "./Navbar";
import axios from "axios";
import {Link} from "react-router-dom";
import {SERVER_HOST} from "../config/global_constants";

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginEmail: '',
            loginPassword: '',
            role: 'user',
        }
    }

    handleLogin = async (e) => {
        e.preventDefault();
        console.log('Logging in with:', this.state.loginEmail, this.state.loginPassword);

        try {
            const res = await axios.post(`${SERVER_HOST}/users/Login`, { // Use correct endpoint
                email: this.state.loginEmail,
                password: this.state.loginPassword
            });

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                this.setState({ isLoggedIn: true });
                alert('Login successful');
            } else {
                alert('Login failed.');
            }
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error);
            alert('Login failed. Check email and password.');
        }
    };


    handleRoleChange = (e) => {
        this.setState({ role: e.target.value });
    }

    render() {
        return (
            <div>
                <Navbar/>
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
                                        name="loginEmail"
                                        value={this.state.loginEmail}
                                        onChange={e => this.setState({loginEmail: e.target.value})}
                                        required
                                    />
                                </label>
                                <label>
                                    Password *
                                    <input
                                        type="password"
                                        name="loginPassword"
                                        value={this.state.loginPassword}
                                        onChange={e => this.setState({loginPassword: e.target.value})}
                                        required
                                    />
                                </label>
                                <select value={this.state.role} onChange={this.handleRoleChange}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div>
                                    <input type="checkbox"/> Remember Me
                                </div>
                                <button type="submit">Log in</button>
                                <a href="#">Lost your password?</a>
                            </div>
                        </form>

                        {/* Displaying different content based on role option */}
                        <div style={{marginLeft: 20}}>
                            {this.state.role === 'user' && (
                                <div>
                                    <h3>Welcome, User!</h3>
                                    <p className="switch">Access your personalized dashboard and manage your account.</p>
                                    <br/>
                                    <p className="switch">Don't have an account?</p>
                                    <Link to="/Register">Register</Link>
                                </div>
                            )}
                            {this.state.role === 'admin' && (
                                <div>
                                    <h3>Welcome, Admin!</h3>
                                    <p>Manage users, view analytics, and configure settings.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;

// import React, { Component } from "react";
// import axios from "axios";
// import { SERVER_HOST } from "../config/global_constants";
// import { Button } from "react-bootstrap";
// import { Link, Redirect } from "react-router-dom";
//
// class Login extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loginEmail: '',
//             loginPassword: '',
//             isLoggedIn: false
//         };
//     }
//
//     handleChange = (e) => {
//         this.setState({ [e.target.name]: e.target.value });
//     };
//
//     handleSubmit = (e) => {
//         e.preventDefault();
//
//         axios.post(`${SERVER_HOST}/users/login`, {
//             email: this.state.loginEmail,
//             password: this.state.loginPassword
//         })
//
//             .then(res => {
//                 if (res.data) {
//                     if (res.data.errorMessage) {
//                         console.log(res.data.errorMessage);
//                     } else {
//                         console.log("User logged in");
//
//                         // Store token for authentication
//                         localStorage.setItem("token", res.data.token);
//                         localStorage.setItem("role", res.data.role); // Store role if needed
//
//                         this.setState({ isLoggedIn: true });
//                     }
//                 } else {
//                     console.log("Login failed");
//                 }
//             })
//             .catch(error => {
//                 console.error("Error during login:", error);
//             });
//     };
//
//     render() {
//         return (
//             <form className="form-container" noValidate id="loginOrRegistrationForm">
//                 <h2>Login</h2>
//                 {this.state.isLoggedIn && <Redirect to="/mainpage" />}
//
//                 <input
//                     type="email"
//                     name="loginEmail"
//                     placeholder="Email"
//                     autoComplete="email"
//                     value={this.state.loginEmail}
//                     onChange={this.handleChange}
//                 /><br/>
//
//                 <input
//                     type="password"
//                     name="loginPassword"
//                     placeholder="Password"
//                     autoComplete="password"
//                     value={this.state.loginPassword}
//                     onChange={this.handleChange}
//                 /><br/><br/>
//
//                 <Button className="green-button" onClick={this.handleSubmit}>Login</Button>
//                 <Link className="red-button" to={"/mainpage"}>Cancel</Link>
//             </form>
//         );
//     }
// }
//
// export default Login;
