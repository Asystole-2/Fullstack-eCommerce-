import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
        };
    }

    handleLogin = (e) => {
        e.preventDefault();
        console.log('Login with:', this.state.loginEmail, this.state.loginPassword);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleLogin}>
                    <h2>Login</h2>
                    <label>
                        Email Address *
                        <input type="email" value={this.state.loginEmail} onChange={e => this.setState({ loginEmail: e.target.value })} required />
                    </label>
                    <label>
                        Password *
                        <input type="password" value={this.state.loginPassword} onChange={e => this.setState({ loginPassword: e.target.value })} required />
                    </label>
                    <div>
                        <input type="checkbox" /> Remember Me
                    </div>
                    <button type="submit">Log in</button>
                    <a href="#">Lost your password?</a>
                    <p>Don't have an account? <a href="/register">Create one</a></p>
                </form>
            </div>
        );
    }
}

export default Login;