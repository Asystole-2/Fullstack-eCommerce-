import React, { Component } from "react";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants";
// import UserAPI from "../services/UserAPI";

export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [] };
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
                            <td>{user.password}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}