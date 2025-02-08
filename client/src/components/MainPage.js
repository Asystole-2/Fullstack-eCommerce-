import React, { Component } from "react"
import Navbar from "./Navbar"
import Products from "./Products"

export default class  MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <Navbar />
                <div className="content">
                    <Products />
                </div>
            </div>
        )
    }
}

