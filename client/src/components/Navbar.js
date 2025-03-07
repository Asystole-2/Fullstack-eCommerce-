import React, { Component } from "react";
import { Link } from "react-router-dom";
import SearchContext from "./SearchContext";

export default class Navbar extends Component {
    static contextType = SearchContext;

    handleSearch = (event) => {
        this.context.setSearchQuery(event.target.value);
    };

    handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear(); // Clear sessionStorage as well
        window.location.href = '/login';    // Redirect to login
    };

    render() {
        const isLoggedIn = sessionStorage.getItem('token') !== null; // Check if the user is logged in

        // Get profile photo from localStorage (if available)
        const profilePhoto = sessionStorage.getItem('profilePhoto');

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
                    <Link to="/"><i className="fas fa-heart"></i></Link>
                    <Link to="/cart"><i className="fas fa-shopping-cart"></i></Link>

                    {/* Show profile picture if logged in */}
                    {isLoggedIn && profilePhoto ? (
                        <img
                            src={`uploads/${profilePhoto}`} // Profile image from uploads folder
                            alt="Profile"
                            className="profile-photo"
                        />
                    ) : (
                        <Link to="/Login"><i className="fas fa-user"></i></Link> // Show login if not logged in
                    )}

                    {/* Show logout button if logged in */}
                    {isLoggedIn && (
                        <div>
                            <button onClick={this.handleLogout} className="logout-button">Logout</button>
                        </div>
                    )}
                </div>
            </nav>
        );
    }
}
