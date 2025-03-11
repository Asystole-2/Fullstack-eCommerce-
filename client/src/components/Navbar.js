import React, { Component } from "react";
import { Link } from "react-router-dom";
import SearchContext from "./SearchContext";

export default class Navbar extends Component {
    static contextType = SearchContext;

    handleSearch = (event) => {
        this.context.setSearchQuery(event.target.value);
    };

    render() {
        const accessLevel = parseInt(localStorage.getItem('accessLevel')) || 0;
        const profilePhoto = localStorage.getItem('profilePhoto');
        console.log('Current accessLevel:', accessLevel);

        return (
            <nav className="navbar">
                <Link to="/MainPage">
                    <div className="logo">MyShop</div>
                </Link>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={this.handleSearch}
                    />
                    <button>
                        <i className="fas fa-search"></i>
                    </button>
                </div>

                <div className="nav-icons">
                    <Link to="/Home">Home</Link>
                    <Link to="/MainPage">Shop</Link>
                    <Link to="/Aboutpage">About us</Link>
                    <Link to="/"><i className="fas fa-heart"></i></Link>
                    <Link to="/cart"><i className="fas fa-shopping-cart"></i></Link>

                    {accessLevel > 0 && profilePhoto && profilePhoto !== "null" ? (
                        <img
                            id="profilePhoto"
                            src={`data:;base64,${profilePhoto}`}
                            alt="Profile"
                        />
                    ) : null}

                    <Link to={accessLevel > 0 ? "/UserProfile" : "/Login"}>
                        <i className="fas fa-user"></i>
                    </Link>
                </div>
            </nav>
        );
    }
}
