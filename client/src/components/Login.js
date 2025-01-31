import React from 'react'
import Navbar from "./Navbar";

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginEmail: '',
            loginPassword: '',
            registerEmail: '',
            registerPassword: '',
            confirmPassword: '',
            role: 'user',
        }
    }

    handleLogin = (e) => {
        e.preventDefault()
        console.log('Login with:', this.state.loginEmail, this.state.loginPassword)
        // Add login logic here
    }

    handleRoleChange = e => {
        this.setState({role: e.target.value})
    }

    handleRegister = (e) => {
        e.preventDefault()
        if (this.state.registerPassword !== this.state.confirmPassword) {
            alert('Passwords do not match')
            return
        }
        console.log('Register with:', this.state.registerEmail, this.state.registerPassword)
        // Add registration logic here
    }

    render() {
        return (
            <div>
            <Navbar/>
            <div className="login">
                <div className="login-container">
                    {/* Login Form */}
                    <form onSubmit={this.handleLogin}>
                        <h2>Login</h2>
                        <div className="input-group">
                            <label>
                                Email Address *
                                <input type="email" value={this.state.loginEmail}
                                       onChange={e => this.setState({loginEmail: e.target.value})} required/>
                            </label>
                            <label>
                                Password *
                                <input type="password" value={this.state.loginPassword}
                                       onChange={e => this.setState({loginPassword: e.target.value})} required/>
                            </label>
                            <select value={this.state.role} onChange={this.handleRoleChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div>
                                <input type="checkbox"/>Remember Me
                            </div>
                            <button type="submit">Log in</button>
                            <a href="#">Lost your password?</a>
                        </div>
                    </form>

                    {/* Displaying different content based on role option */}
                    <div style={{marginLeft: 20}}>
                        {this.state.role === 'user' && (
                            <div>
                                <h3>Welcome, User!</h3>
                                <p className="switch">Access your personalized dashboard and manage your account.</p>
                                <br/>
                                <p className="switch">Don't have an account?</p>
                                <a href="/Register.js">Register</a>
                            </div>
                        )}
                        {this.state.role === 'admin' && (
                            <div>
                                <h3>Welcome, Admin!</h3>
                                <p>Manage users, view analytics, and configure settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Login