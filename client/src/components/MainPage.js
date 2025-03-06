import React, {Component} from "react"
import Products from "./Products"

export default class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <div className="content">
                    <Products/>
                </div>
            </div>
        )
    }
}

