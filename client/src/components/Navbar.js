import React, {Component} from "react"
import {Link} from "react-router-dom"

export default class Navbar extends Component {
    render() {

            return (
                <nav className="navbar">
                    <Link to="/MainPage">
                        <div className="logo">MyShop</div>
                    </Link>

                    <div className="search-box">
                        <input type="text" placeholder="Search..."/>
                        <button><i className="fas fa-search"></i></button>
                    </div>

                    <div className="nav-icons">
                        <Link to="/"><i className="fas fa-heart"></i></Link>
                        <Link to="/"><i className="fas fa-shopping-cart"></i></Link>
                        <Link to="Login"><i className="fas fa-user"></i></Link>
                    </div>
                </nav>
            )

    }
}