import React, {Component} from "react"
import Navbar from "./Navbar"
import Products from "./Products"
import UsersList from "./UsersLists";

export default class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <Navbar/>
                <div className="content">
                    <Products/>
                    <UsersList/>
                </div>
            </div>
        )
    }
}

