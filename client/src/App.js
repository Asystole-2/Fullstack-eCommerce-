import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import MainPage from "./components/MainPage"
import Login from "./components/Login"
import Register from "./components/Register"
import AddInstrument from "./components/AddInstrument"
import "./css/App.css"
import EditInstrument from "./components/EditInstrument"
import {SearchProvider} from "./components/SearchContext"
import CartPage from './components/CartPage' // Adjust path if needed
import Navbar from "./components/Navbar"
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"
import LoggedInRoute from "./components/LoggedInRoute"
import AdminRoute from "./components/AdminRoute"
import AboutPage from "./components/AboutPage"
import Home from "./components/Home"

if (typeof localStorage.accessLevel === "undefined")
{
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
    localStorage.profilePhoto = null
}
export default class App extends Component {
    render() {
        return (
            <SearchProvider>
                <BrowserRouter>
                    <Navbar/>
                    <div>
                        <Switch>
                            <Route exact path="/MainPage" component={MainPage}/>
                            <Route exact path="/Login" component={Login}/>
                            <Route exact path="/Register" component={Register}/>
                            <AdminRoute exact path="/AddInstrument" component={AddInstrument}/>
                            <AdminRoute exact path="/EditInstrument/:id" component={EditInstrument}/>
                            <CartPage exact path="/cart" component={CartPage}/>
                            <Route exact path="/Aboutpage" component={AboutPage}/>
                            <Route exact path="/Home" component={Home}/>
                            <Route component={Home}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </SearchProvider>
        )
    }
}
