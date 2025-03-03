import React, {Component} from "react"
import {Link} from "react-router-dom"
import SearchContext from "./SearchContext"

export default class Navbar extends Component {
    static contextType = SearchContext;

    handleSearch = (event) => {
        this.context.setSearchQuery(event.target.value)
    }

    render() {

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
                    <Link to="/Login"><i className="fas fa-user"></i></Link>
                </div>
            </nav>
        )

    }
}