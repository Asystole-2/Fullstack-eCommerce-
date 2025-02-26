import React from 'react';
import Navbar from "./Navbar";
import {Link} from "react-router-dom";
import {Redirect} from "react-router-dom";
import LinkInClass from "./LinkInClass";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            isRegistered: false
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`)

            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    } else {
                        console.log("Record added")
                        this.setState({isRegistered: true})
                    }
                } else {
                    console.log("Record not added")
                }
            })

    }

    render() {
        return (
            <div>
                <Navbar/>
                <div className="register">
                    <div className="register-container">
                        {/* Register Form */}
                        <div className="input-group">
                            <h2>Register</h2>
                            <form className="form-container" noValidate={true} id="registerForm">
                                {this.state.isRegistered ? <Redirect to="/MainPage"/> : null}
                                <label>
                                    Name*
                                    <input
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        ref={(input) => {
                                            this.inputToFocus = input
                                        }}
                                    />
                                </label>

                                <label>
                                    Email*
                                    <input
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        ref={(input) => {
                                            this.inputToFocus = input
                                        }}
                                    />
                                </label>

                                <label>
                                    Password*
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        ref={(input) => {
                                            this.inputToFocus = input
                                        }}
                                    />
                                </label>

                                <label>
                                    Confirm Password*
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="current-password"
                                        value={this.state.confirmPassword}
                                        onChange={this.handleChange}
                                        ref={(input) => {
                                            this.inputToFocus = input
                                        }}
                                    />
                                </label>

                                <LinkInClass value="Register New User" className="green-button"
                                             onClick={this.handleSubmit}/>
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