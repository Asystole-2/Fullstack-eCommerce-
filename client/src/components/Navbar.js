import React, {Component} from "react"
import {Link} from "react-router-dom"

export default class Navbar extends Component {
    render() {

            return (
                <nav className="navbar">
                    <div className="logo">
                        <h1>Sīrən</h1>
                    </div>
                    <div className="nav-links">
                        <Link to="/Login">
                            <i className="icon-user">👤</i>
                        </Link>
                        <Link to="/basket">
                            <i className="icon-basket">🛒</i>
                        </Link>
                        <Link to="/AdminLogin">
                            <i className="icon-smiley">😀</i>
                        </Link>
                    </div>
                </nav>
            )

    }
}