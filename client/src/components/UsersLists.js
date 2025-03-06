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
        axios.get(`${SERVER_HOST}/users`)
            .then(res => {
                if ((res.data)) {
                    console.table(res.data)

                    this.setState({
                        users: res.data,
                    })
                } else {
                    console.log("Record not found")
                }
            })
            .catch(error => console.error("Error fetching instruments:", error))
    }

    // Handle DELETE request
    handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        console.log("Deleting user with ID:", id);

        try {
            const response = await fetch(`http://localhost:4000/api/user/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("User deleted successfully!");
                if (this.state.users) {
                    this.setState({
                        users: this.state.users.filter(user => user._id !== id)
                    });
                }
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