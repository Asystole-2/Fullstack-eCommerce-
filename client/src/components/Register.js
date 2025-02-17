
import React, {Component} from "react";
import {Redirect,Link} from "react-router-dom";
import LinkInClass from "../components/LinkInClass";
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"


export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name:"",
            email:"",
            password:"",
            confirmPassword:"",
            isRegistered:false
        }
    }
    handleChange = (e) =>
    {
        this.setState({[e.target.name]: e.target.value})
    }
    handleSubmit =(e)=>
    {
        e.preventDefault();
        axios.post(`${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`)

            .then(res =>
            {
                if(res.data)
                {
                    if (res.data.errorMessage)
                    {
                        console.log(res.data.errorMessage)
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

    }
    render() {
        return (
            <form className="form-container" noValidate={true} id="registerForm">
                {this.state.isRegistered ? <Redirect to="/MainPage"/> : null}
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

                <LinkInClass value="Register New User" className="green-button" onClick={this.handleSubmit}/>
                <Link className="red-button" to={"/MainPage"}>Cancel</Link>


            </form>
        )


    }

}