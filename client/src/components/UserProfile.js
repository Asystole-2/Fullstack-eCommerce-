import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import SearchContext from "./SearchContext";

export default class UserProfile extends Component {
    static contextType = SearchContext;

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            errors: {},
            successMessage: "",
        };
    }

    componentDidMount() {
        const { user } = this.context;
        this.setState({
            name: user?.name || "",
            email: user?.email || "",
            password: "", // Clear password for security
            confirmPassword: ""
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, successMessage: "" });
    };

    validateName = (name) => {
        return /^[a-zA-Z\s]{3,50}$/.test(name);
    };

    validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    validatePassword = (password) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
    };

    handleSave = (field) => {
        const { user, updateUser } = this.context;
        let updatedUser = { ...user };
        let errors = {};

        if (field === "name" && !this.validateName(this.state.name)) {
            errors.name = "Name must be between 3 and 50 characters and contain only letters and spaces.";
        } else if (field === "email" && !this.validateEmail(this.state.email)) {
            errors.email = "Invalid email format.";
        } else if (field === "password") {
            if (!this.validatePassword(this.state.password)) {
                errors.password = "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character.";
            } else if (this.state.password !== this.state.confirmPassword) {
                errors.confirmPassword = "Passwords do not match.";
            }
        }

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        updatedUser[field] = this.state[field];

        axios
            .put(`${SERVER_HOST}/users/update`, { [field]: this.state[field] })
            .then((res) => {
                if (res.data && res.data.errorMessage) {
                    this.setState({ errors: { server: res.data.errorMessage } });
                } else {
                    updateUser(updatedUser);
                    this.setState({ successMessage: `${field} updated successfully!`, errors: {} });
                    if (field === "password") {
                        this.setState({ password: "", confirmPassword: "" });
                    }
                }
            })
            .catch(() => {
                this.setState({ errors: { server: "Update failed. Please try again." } });
            });
    };

    render() {
        return (
            <div className="user-profile">
                <h2>User Profile</h2>

                {this.state.successMessage && <p style={{ color: "green" }}>{this.state.successMessage}</p>}

                <div className="profile-section">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                    <button onClick={() => this.handleSave("name")}>Save</button>
                    {this.state.errors.name && <p style={{ color: "red" }}>{this.state.errors.name}</p>}
                </div>

                <div className="profile-section">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                    <button onClick={() => this.handleSave("email")}>Save</button>
                    {this.state.errors.email && <p style={{ color: "red" }}>{this.state.errors.email}</p>}
                </div>

                <div className="profile-section">
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </div>

                <div className="profile-section">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    />
                    <button onClick={() => this.handleSave("password")}>Save</button>
                    {this.state.errors.password && <p style={{ color: "red" }}>{this.state.errors.password}</p>}
                    {this.state.errors.confirmPassword && <p style={{ color: "red" }}>{this.state.errors.confirmPassword}</p>}
                </div>

                {this.state.errors.server && <p style={{ color: "red" }}>{this.state.errors.server}</p>}
            </div>
        );
    }
}
