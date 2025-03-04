import React, { Component } from 'react';
import { AdminAPI } from '../services/AdminAPI';
import { Redirect } from 'react-router-dom';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            isLoggedIn: false
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { email, password } = this.state;
            const { data } = await AdminAPI.adminLogin({ email, password });

            localStorage.setItem('adminToken', data.token);
            this.setState({ isLoggedIn: true });
        } catch (err) {
            this.setState({ error: err.response?.data?.message || 'Login failed' });
        }
    };

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to="/admin/dashboard" />;
        }

        return (
            <div>
                <h2>Admin Login</h2>
                {this.state.error && <p>{this.state.error}</p>}
                <form onSubmit={this.handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default Admin;