import React, { Component } from "react";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";

import DetailsDisplay from "./DetailsDisplay";
import UsersList from "./UsersLists"

import { ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_USER } from "../config/global_constants";

export default class UserProfile extends Component {
    state = {
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        profilePhoto: localStorage.getItem("profilePhoto"),
        editingField: null,
        newValue: "",
        newPassword: "",
        confirmPassword: "",
        errorMessage: "",
        loggedOut: false,
    };

    componentDidMount() {
        // Fetch user profile data
        axios
            .get(`${SERVER_HOST}/users/me`, {
                headers: { Authorization: `Bearer ${localStorage.token}` },
            })
            .then((res) => {
                const { name, email, profilePhoto } = res.data;
                this.setState({
                    name: name || "",
                    email: email || "",
                    profilePhoto: profilePhoto || "",
                });
                // Store in localStorage for consistency
                localStorage.setItem("name", name || "");
                localStorage.setItem("email", email || "");
                localStorage.setItem("profilePhoto", profilePhoto || "");
            })
            .catch((err) => {
                console.error(err);
                this.setState({ errorMessage: "Failed to fetch user data." });
            });
    }

    handleEdit = (field) => {
        this.setState({
            editingField: field,
            newValue: "",
            newPassword: "",
            confirmPassword: "",
            errorMessage: "",
        });
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

            axios
                .put(
                    `${SERVER_HOST}/users/update`,
                    { password: newPassword },
                    { headers: { Authorization: `Bearer ${localStorage.token}` } }
                )
                .then((res) => {
                    this.setState({ editingField: null, errorMessage: "" });
                    alert("Password changed successfully.");
                })
                .catch((err) => {
                    this.setState({
                        errorMessage: err.response?.data?.error || "Error updating password.",
                    });
                });
        } else {
            if (newValue === this.state[editingField]) {
                this.setState({ errorMessage: "New value must be different." });
                return;
            }

            axios
                .put(
                    `${SERVER_HOST}/users/update`,
                    { [editingField]: newValue },
                    { headers: { Authorization: `Bearer ${localStorage.token}` } }
                )
                .then((res) => {
                    localStorage.setItem(editingField, newValue);
                    this.setState({
                        [editingField]: newValue,
                        editingField: null,
                        errorMessage: "",
                    });
                })
                .catch((err) => {
                    this.setState({
                        errorMessage: err.response?.data?.error || "Error updating profile.",
                    });
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

        const {
            name,
            email,
            profilePhoto,
            editingField,
            newValue,
            newPassword,
            confirmPassword,
            errorMessage,
        } = this.state;

        const userAccessLevel = localStorage.getItem("accessLevel");

        return (
            <div className="user-profile-container">
                <h2>User Profile</h2>
                <div className="profile-section">
                    {profilePhoto && (
                        <div className="profile-photo-container">
                            <img
                                src={`data:;base64,${profilePhoto}`}
                                alt="Profile"
                                className="profile-photo"
                            />
                            <button
                                className="edit-button"
                                onClick={() => this.handleEdit("profilePhoto")}
                            >
                                Change Photo
                            </button>
                        </div>
                    )}
                </div>

                <div className="user-info">
                    {["name", "email"].map((field) => (
                        <div className="info-item" key={field}>
                            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                            {editingField === field ? (
                                <>
                                    <input
                                        type="text"
                                        value={newValue}
                                        onChange={(e) => this.setState({ newValue: e.target.value })}
                                    />
                                    <button className="save-button" onClick={this.handleSave}>
                                        Save
                                    </button>
                                    <button
                                        className="cancel-button"
                                        onClick={() => this.setState({ editingField: null })}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>{this.state[field]}</span>
                                    <button
                                        className="edit-button"
                                        onClick={() => this.handleEdit(field)}
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="password-section">
                    <button
                        className="edit-button"
                        onClick={() => this.handleEdit("password")}
                    >
                        Change Password
                    </button>
                    {editingField === "password" && (
                        <div className="password-inputs">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => this.setState({ newPassword: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                            />
                            <button className="save-button" onClick={this.handleSave}>
                                Save
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => this.setState({ editingField: null })}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {userAccessLevel >= ACCESS_LEVEL_ADMIN ?
                    <div className="view-users">
                        <div className="view-users">
                            <UsersList userAccessLevel={userAccessLevel} />
                        </div>
                    </div>
                    :
                    null
                }

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button className="logout-button" onClick={this.handleLogout}>
                    Logout
                </button>

                {/* Purchase History Section */}
                <DetailsDisplay />
            </div>
        );
    }
}