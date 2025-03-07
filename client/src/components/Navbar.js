import React, { Component } from "react";
import { Link } from "react-router-dom";
import SearchContext from "./SearchContext";

export default class Navbar extends Component {
    static contextType = SearchContext;

    handleSearch = (event) => {
        this.context.setSearchQuery(event.target.value)
    };

    handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/login';
    };

    render() {
        const isLoggedIn = sessionStorage.getItem('token') !== null;
        const profilePhoto = sessionStorage.getItem('profilePhoto');

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
                    <Link to="/"><i className="fas fa-heart"></i></Link>
                    <Link to="/cart"><i className="fas fa-shopping-cart"></i></Link>

                    {/* Show profile picture and logout button if logged in */}
                    {isLoggedIn && profilePhoto ? (
                        <>
                            <img
                                src={`uploads/${profilePhoto}`}
                                alt="Profile"
                                className="profile-photo"
                            />
                            <button onClick={this.handleLogout} className="logout-button">
                                Logout
                            </button>
                        </>
                    ) : (

                        <Link to="/Login"><i className="fas fa-user"></i></Link>
                    )}
                </div>
            </nav>
        );
    }
}
