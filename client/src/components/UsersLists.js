import React, {Component} from "react";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants";

export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {users: []};

        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        const token = localStorage.getItem("token"); // ✅ Retrieve JWT token

        if (!token) {
            console.error("User is not logged in");
            alert("Please log in to view users.");
            return;
        }

        axios.get(`${SERVER_HOST}/users`, {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach JWT
        })
            .then(res => {
                if (res.data) {
                    console.table(res.data);
                    this.setState({ users: res.data });
                } else {
                    console.log("Record not found");
                }
            })
            .catch(error => console.error("Error fetching users:", error));
    }

// ✅ Handle DELETE with JWT authentication
    handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        console.log("Deleting user with ID:", id);

        const token = localStorage.getItem("token"); // ✅ Retrieve JWT token

        if (!token) {
            alert("You must be logged in to delete a user.");
            return;
        }

        try {
            const response = await fetch(`${SERVER_HOST}/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("User deleted successfully!");
                this.setState({
                    users: this.state.users.filter(user => user._id !== id),
                });
            } else {
                alert("Error deleting user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    render() {
        return (
            <div>
                <h1>Users List</h1>
                <table border="1">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => this.handleDelete(user._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}