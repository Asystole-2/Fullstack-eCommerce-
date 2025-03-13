import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";

class UserProfile extends Component {
    state = {
        name: localStorage.getItem('name') || "",
        email: localStorage.getItem('email') || "",
        profilePhoto: localStorage.getItem('profilePhoto'),
        editingField: null,
        newValue: "",
        newPassword: "",
        confirmPassword: "",
        errors: {},
        errorMessage: "",
        loggedOut: false
    }

    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/users/me`, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        })
            .then(res => {
                const { name, email, profilePhoto } = res.data;
                this.setState({
                    name: name || "",
                    email: email || "",
                    profilePhoto: profilePhoto || ""
                })

            })
            .catch(err => {
                console.error(err);
                this.setState({ errorMessage: "Failed to fetch user data." });
            });
    }

    // Validation functions
    validateName = (name) =>
    {
        return /^[a-zA-Z\s]{3,50}$/.test(name);
    }
    validateEmail = (email) =>
    {
        return /\S+@\S+\.\S+/.test(email);
    }
    validatePassword = (password) =>
    {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
    }

    handleEdit = (field) => {
        this.setState({
            editingField: field,
            newValue: this.state[field],
            newPassword: "",
            confirmPassword: "",
            errors: {},
            errorMessage: "" });
    };

    handleSave = () => {
        const { editingField, newValue, newPassword, confirmPassword } = this.state;
        let errors = {};

        if (editingField === "password") {
            if (!newPassword || !confirmPassword) {
                errors.password = "Both password fields are required.";
            } else if (newPassword !== confirmPassword) {
                errors.confirmPassword = "Passwords do not match.";
            } else if (!this.validatePassword(newPassword)) {
                errors.password = "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.";
            }
        } else if (editingField === "name") {
            if (!this.validateName(newValue)) {
                errors.name = "Name must be between 3 and 50 characters and contain only letters and spaces.";
            }
        } else if (editingField === "email") {
            if (!this.validateEmail(newValue)) {
                errors.email = "Invalid email format.";
            }
        }

        // If there are errors, display them and stop the request
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        const updateData = editingField === "password" ? { password: newPassword } : { [editingField]: newValue };

        axios.put(`${SERVER_HOST}/users/update`, updateData,
            { headers: { Authorization: `Bearer ${localStorage.token}` } }
        ).then(res => {
            if (editingField !== "password") {
                localStorage.setItem(editingField, newValue);
                this.setState({ [editingField]: newValue });
            }
            this.setState({ editingField: null, errors: {}, errorMessage: "" });
            alert("Profile updated successfully.");
        }).catch(err => {
            this.setState({ errorMessage: err.response?.data?.error || "Error updating profile." });
        });
    };

    handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        this.setState({ loggedOut: true });
        window.location.href = "/MainPage";
    };

    render() {
        if (this.state.loggedOut) {
            return <Redirect to="/Login" />;
        }

        return (
            <div className="user-profile-container">
                <h2>User Profile</h2>
                <div className="profile-section">
                    {this.state.profilePhoto && (
                        <div className="profile-photo-container">
                            <img src={`data:;base64,${this.state.profilePhoto}`} alt="Profile" className="profile-photo" />
                            <button className="edit-button" onClick={() => this.handleEdit("profilePhoto")}>Change Photo</button>
                        </div>
                    )}
                </div>

                <div className="user-info">
                    {['name', 'email'].map(field => (
                        <div className="info-item">
                            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                            {this.state.editingField === field ? (
                                <>
                                    <input
                                        type="text"
                                        value={this.state.newValue}
                                        onChange={e => this.setState({ newValue: e.target.value })}
                                        className={this.state.errors[field] ? "input-error" : ""}
                                    />
                                    <button className="save-button" onClick={this.handleSave}>Save</button>
                                    <button className="cancel-button" onClick={() => this.setState({ editingField: null })}>Cancel</button>
                                    {this.state.errors[field] && <p className="error-message">{this.state.errors[field]}</p>}
                                </>
                            ) : (
                                <>
                                    <span>{this.state[field]}</span>
                                    <button className="edit-button" onClick={() => this.handleEdit(field)}>Edit</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="password-section">
                    <button className="edit-button" onClick={() => this.handleEdit("password")}>Change Password</button>
                    {this.state.editingField === "password" && (
                        <div className="password-inputs">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={this.state.newPassword}
                                onChange={e => this.setState({ newPassword: e.target.value })}
                            />
                            {this.state.errors.password && <p style={{ color: "red" }}>{this.state.errors.password}</p>}
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={this.state.confirmPassword}
                                onChange={e => this.setState({ confirmPassword: e.target.value })}
                            />
                            {this.state.errors.confirmPassword && <p style={{ color: "red" }}>{this.state.errors.confirmPassword}</p>}
                            <button className="save-button" onClick={this.handleSave}>Save</button>
                            <button className="cancel-button" onClick={() => this.setState({ editingField: null })}>Cancel</button>
                        </div>
                    )}
                </div>

                {this.state.errorMessage && (
                    <p className="error-message" style={{ color: "red" }}>{this.state.errorMessage}</p>
                )}

                <button className="logout-button" onClick={this.handleLogout}>Logout</button>
            </div>
        );
    }
}

export default UserProfile;
