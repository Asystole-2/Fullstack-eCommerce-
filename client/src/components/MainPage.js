import React, {Component} from "react"
import Navbar from "./Navbar"
import Products from "./Products"
import {SearchProvider} from "./SearchContext";

export default class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <Navbar/>
                <div className="content">
                    <SearchProvider>
                        <Products/>
                    </SearchProvider>
                </div>
            </div>
        )
    }
}

