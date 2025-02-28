import React, {Component} from "react";
import {Redirect,Link} from "react-router-dom";
import LinkInClass from "../components/LinkInClass";
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"


export default class Register extends Component
{
    componentDidMount()
    {
        if (this.inputToFocus) {
            this.inputToFocus.focus();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            name:"",
            email:"",
            password:"",
            confirmPassword:"",
            isRegistered:false,
            errors:{}
        }
    }
    handleChange = (e) =>
    {
        this.setState({
            [e.target.name]: e.target.value,
            errors: { ...this.state.errors, [e.target.name]: "" }
        });
    }

    handleSubmit =(e)=>
    {
        e.preventDefault();
        if (this.validate())
        {
            axios.post(`${SERVER_HOST}/users/register`,
            {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            })

        .then(res =>
        {
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    this.setState({ errors: { general: res.data.errorMessage } })
                }
                else
                {
                    console.log("Record added")
                    this.setState({isRegistered:true})
                }
            }
            else
            {
                console.log("Record not added")
            }
        })
            .catch (() =>
            {
                this.setState({ errors: { general: "Registration failed."} })
            })
        }
    }

    validateName = (e) =>
    {
        return this.state.name.trim() !== "";//
    }

    validateEmail = (e) =>
    {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(this.state.email)
    }
    validatePassword = (e) =>
    {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(this.state.password)
    }
    validateConfirmPassword = (e) =>
    {
        return this.state.password === this.state.confirmPassword
    }
    validate()
    {
        const errors = {};
        if(!this.validateName()){errors.name = "Name cannot be empty"}
        if(!this.validateEmail()){errors.email = "Invalid email format"}
        if (!this.validatePassword()){errors.password =  "- Password must be at least 8 characters long\n" +
            "- Password must contain at least one upper case letter\n" +
            "- Password must contain one number and symbol"}
        if(!this.validateConfirmPassword()){errors.confirmPassword = "Passwords do not match"}

        this.setState({errors})
        return Object.keys(errors).length === 0;
    }

    render() {
        return (
            <form className="form-container" noValidate={true} id="registerForm">
                <h1>Register</h1>
                {this.state.isRegistered ? <Redirect to="/MainPage"/> : null}
                {this.state.errors.general && <p className="error">{this.state.errors.general}</p>}
                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.inputToFocus = input
                    }}
                />
                {this.state.errors.name && <p className="error">{this.state.errors.name}</p>}

                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.inputToFocus = input
                    }}
                />
                {this.state.errors.email && <p className="error">{this.state.errors.email}</p>}

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.inputToFocus = input
                    }}
                />
                {this.state.errors.password && (
                    <ul className="error">
                        {this.state.errors.password.split("\n").map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                )}
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="current-password"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.inputToFocus = input
                    }}
                />
                {this.state.errors.confirmPassword && <p className="error">{this.state.errors.confirmPassword}</p>}

                <LinkInClass value="Register New User" className="green-button" onClick={this.handleSubmit}/>
                <Link className="red-button" to={"/MainPage"}>Cancel</Link>

            </form>
        )
    }
}