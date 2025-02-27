import React, { Component } from "react";
import UserAPI from "../services/UserAPI";

export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [] };
    }

    async componentDidMount() {
        const users = await UserAPI.getUsers();
        this.setState({ users });
    }

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
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}