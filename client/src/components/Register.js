import React from 'react';
import Navbar from "./Navbar";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerEmail: '',
            registerPassword: '',
            confirmPassword: '',
        };
    }

    handleRegister = (e) => {
        e.preventDefault();
        if (this.state.registerPassword !== this.state.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('Register with:', this.state.registerEmail, this.state.registerPassword);
    };

    render() {
        return (
            <div>
                <Navbar/>
                <div className="register">
                    <div className="register-container">
                        {/* Register Form */}
                        <div className="input-group">
                            <form onSubmit={this.handleRegister}>
                                <h2>Register</h2>
                                <label>
                                    Email Address *
                                    <input type="email" value={this.state.registerEmail}
                                           onChange={e => this.setState({registerEmail: e.target.value})} required/>
                                </label>
                                <label>
                                    Password *
                                    <input type="password" value={this.state.registerPassword}
                                           onChange={e => this.setState({registerPassword: e.target.value})} required/>
                                </label>
                                <label>
                                    Confirm Password *
                                    <input type="password" value={this.state.confirmPassword}
                                           onChange={e => this.setState({confirmPassword: e.target.value})} required/>
                                </label>
                                <button type="submit">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;