import React, {Component} from "react"
import {Link} from "react-router-dom"
import SearchContext from "./SearchContext"
import {ACCESS_LEVEL_GUEST} from "../config/global_constants";

export default class Navbar extends Component {
    static contextType = SearchContext;

    handleSearch = (event) => {
        this.context.setSearchQuery(event.target.value)
    }

    render() {
        const accessLevel = Number(sessionStorage.getItem("accessLevel")) || ACCESS_LEVEL_GUEST;
        console.log(sessionStorage.getItem("accessLevel"));
        const userLink = accessLevel === ACCESS_LEVEL_GUEST ? "/Login" : "/UserProfile";
        console.log(userLink);
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
                    <Link to= {userLink}><i className="fas fa-user"></i></Link>
                </div>
            </nav>
        )

    }
}