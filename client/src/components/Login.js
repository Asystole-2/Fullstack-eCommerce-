import React from 'react'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginEmail: '',
            loginPassword: '',
            registerEmail: '',
            registerPassword: '',
            confirmPassword: '',
        }
    }

    handleLogin = (e) => {
        e.preventDefault()
        console.log('Login with:', this.state.loginEmail, this.state.loginPassword)
    }

    handleRegister = (e) => {
        e.preventDefault()
        if (this.state.registerPassword !== this.state.confirmPassword) {
            alert('Passwords do not match')
            return
        }
        console.log('Register with:', this.state.registerEmail, this.state.registerPassword)
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
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
                </form>

                <form onSubmit={this.handleRegister}>
                    <h2>Register</h2>
                    <label>
                        Email Address *
                        <input type="email" value={this.state.registerEmail} onChange={e => this.setState({ registerEmail: e.target.value })} required />
                    </label>
                    <label>
                        Password *
                        <input type="password" value={this.state.registerPassword} onChange={e => this.setState({ registerPassword: e.target.value })} required />
                    </label>
                    <label>
                        Confirm Password *
                        <input type="password" value={this.state.confirmPassword} onChange={e => this.setState({ confirmPassword: e.target.value })} required />
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        )
    }
}

export default Login