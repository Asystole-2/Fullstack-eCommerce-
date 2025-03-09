import React from 'react';
import { Link, Redirect } from "react-router-dom";
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
            errors: {},
            selectedFile:null,
            isRegistered: false,
        }
    }

    // Function to handle input changes
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleFileChange = (e) =>
    {
        this.setState({selectedFile: e.target.files[0]})
    }

    // Function to validate name
    validateName = (name) => {
        return /^[a-zA-Z\s]{3,50}$/.test(name);
    }

    // Function to validate email
    validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    // Function to validate password
    validatePassword = (password) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
    }

    // Function to handle form submission
    handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, selectedFile } = this.state
        let errors = {};

        // Validate form inputs
        if (!this.validateName(name)) {
            errors.name = "Name must be between 3 and 50 characters and contain only letters and spaces.";
        }
        if (!this.validateEmail(email)) {
            errors.email = "Invalid email format.";
        }
        if (!this.validatePassword(password)) {
            errors.password = "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        // If there are any errors, set state and return early
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        let formData = new FormData()
        formData.append("profilePhoto", selectedFile)
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)

        // Send formData to backend
        try {
            const res = await axios.post(`${SERVER_HOST}/users/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (res.data.errorMessage) {
                this.setState({ errors: { server: res.data.errorMessage } })
            } else {
                // Registration success
                this.setState({ isRegistered: true })
            }
        } catch (error) {
            this.setState({ errors: { server: "Registration failed. Please try again." } })
        }
    };
    render() {
        if (this.state.isRegistered) {
            return <Redirect to="/MainPage" />
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
                                    {this.state.errors.name && <p style={{ color: "red" }}>{this.state.errors.name}</p>}
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
                                    {this.state.errors.email && <p style={{ color: "red" }}>{this.state.errors.email}</p>}
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
                                    {this.state.errors.password && <p style={{ color: "red" }}>{this.state.errors.password}</p>}
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
                                    {this.state.errors.confirmPassword && <p style={{ color: "red" }}>{this.state.errors.confirmPassword}</p>}
                                </label>

                                <label>
                                    <input
                                        type="file"
                                        onChange={this.handleFileChange}
                                        required
                                    />
                                </label>

                                {this.state.errors.server && <p style={{color: "red"}}>{this.state.errors.server}</p>}

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
