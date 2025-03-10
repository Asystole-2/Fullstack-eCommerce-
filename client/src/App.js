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
<<<<<<< HEAD
import AdminRoute from "./components/AdminRoute"
import UserProfile from "./components/UserProfile";
=======
import LoggedInRoute from "./components/LoggedInRoute"
import AdminRoute from "./components/AdminRoute"
import UsersListRoute from "./components/UsersLists"
>>>>>>> admin-login3


if (typeof sessionStorage.accessLevel === "undefined") {
    sessionStorage.name = "GUEST"
<<<<<<< HEAD
    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST

=======
    // sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;
>>>>>>> admin-login3
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
<<<<<<< HEAD
                            <Route exact path ="/UserProfile" component={UserProfile}/>
                            <AdminRoute exact path="/AddInstrument" component={AddInstrument}/>
                            <AdminRoute exact path="/EditInstrument/:id" component={EditInstrument}/>
                            <CartPage exact path="/cart" component={CartPage}/>
=======
                            <Route exact path="/AddInstrument" component={AddInstrument}/>
                            <Route exact path="/EditInstrument/:id" component={EditInstrument}/>
                            <Route exact path="/UsersLists" component={UsersListRoute}/>
                            <LoggedInRoute exact path="/cart" component={CartPage}/>
>>>>>>> admin-login3
                            <Route component={MainPage}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </SearchProvider>
        )
    }
}
