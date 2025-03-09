import React, { Component } from "react";
import { Link } from "react-router-dom";
import SearchContext from "./SearchContext";

export default class Navbar extends Component {
    static contextType = SearchContext;

    handleSearch = (event) => {
        this.context.setSearchQuery(event.target.value);
    };

    handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token in localStorage
        localStorage.removeItem('profilePhoto'); // Clear the profile photo from localStorage
        sessionStorage.clear();
        this.forceUpdate();
    };

    render() {
        const isLoggedIn = localStorage.getItem('token') !== null;
        const profilePhoto = localStorage.getItem('profilePhoto');

        // Debugging output
        console.log('Is logged in:', isLoggedIn);
        console.log('Profile photo:', profilePhoto);

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

                    {/* Show profile picture and logout button if logged in */}
                    {isLoggedIn && profilePhoto ? (
                        <>
                            {localStorage.profilePhoto !== "null" ? (
                                <img
                                    id="profilePhoto"
                                    src={`data:;base64,${localStorage.profilePhoto}`}
                                    alt="Profile"
                                />
                            ) : null}

                            <button onClick={this.handleLogout} className="logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        // Show login button if not logged in
                        <Link to="/Login"><i className="fas fa-user"></i></Link>
                    )}
                </div>
            </nav>
        );
    }
}
