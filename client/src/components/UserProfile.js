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
        errorMessage: "",
        loggedOut: false
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/users/me`, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        })
            .then(res => {
                const { name, email, profilePhoto } = res.data;
                this.setState({
                    name: name || "",
                    email: email || "",
                    profilePhoto: profilePhoto || ""
                });
                // Store in localStorage for consistency
                localStorage.setItem("name", name || "");
                localStorage.setItem("email", email || "");
                localStorage.setItem("profilePhoto", profilePhoto || "");
            })
            .catch(err => {
                console.error(err);
                this.setState({ errorMessage: "Failed to fetch user data." });
            });
    }

    handleEdit = (field) => {
        this.setState({ editingField: field, newValue: "", newPassword: "", confirmPassword: "", errorMessage: "" });
    };

    handleSave = () => {
        const { editingField, newValue, newPassword, confirmPassword } = this.state;

        if (editingField === "password") {
            if (!newPassword || !confirmPassword) {
                this.setState({ errorMessage: "Both password fields are required." });
                return;
            }

            if (newPassword !== confirmPassword) {
                this.setState({ errorMessage: "Passwords do not match." });
                return;
            }

            axios.put(`${SERVER_HOST}/users/update`, { password: newPassword },
                { headers: { Authorization: `Bearer ${localStorage.token}` } }
            ).then(res => {
                this.setState({ editingField: null, errorMessage: "" });
                alert("Password changed successfully.");
            }).catch(err => {
                this.setState({ errorMessage: err.response?.data?.error || "Error updating password." });
            });

        } else {
            if (newValue === this.state[editingField]) {
                this.setState({ errorMessage: "New value must be different." });
                return;
            }

            axios.put(`${SERVER_HOST}/users/update`, { [editingField]: newValue }, // Fixed endpoint
                { headers: { Authorization: `Bearer ${localStorage.token}` } }
            ).then(res => {
                localStorage.setItem(editingField, newValue);
                this.setState({ [editingField]: newValue, editingField: null, errorMessage: "" });
            }).catch(err => {
                this.setState({ errorMessage: err.response?.data?.error || "Error updating profile." });
            });
        }
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
                        <div className="info-item" key={field}>
                            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                            {this.state.editingField === field ? (
                                <>
                                    <input
                                        type="text"
                                        value={this.state.newValue}
                                        onChange={e => this.setState({ newValue: e.target.value })}
                                    />
                                    <button className="save-button" onClick={this.handleSave}>Save</button>
                                    <button className="cancel-button" onClick={() => this.setState({ editingField: null })}>Cancel</button>
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
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={this.state.confirmPassword}
                                onChange={e => this.setState({ confirmPassword: e.target.value })}
                            />
                            <button className="save-button" onClick={this.handleSave}>Save</button>
                            <button className="cancel-button" onClick={() => this.setState({ editingField: null })}>Cancel</button>
                        </div>
                    )}
                </div>

                {this.state.errorMessage && (
                    <p className="error-message">{this.state.errorMessage}</p>
                )}

                <button className="logout-button" onClick={this.handleLogout}>Logout</button>
            </div>
        );
    }
}

export default UserProfile;
