import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"

import MainPage from "./components/MainPage"
import Login from "./components/Login"
import Register from "./components/Register"
import AddInstrument from "./components/AddInstrument"
import "./scss/App.css"
import EditInstrument from "./components/EditInstrument"
import {SearchProvider} from "./components/SearchContext"
import CartPage from './components/CartPage'
import Navbar from "./components/Navbar"
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"
import AboutPage from "./components/AboutPage"
import Home from "./components/Home"
import UsersLists from "./components/UsersLists"

import BuyProduct from "./components/BuyProduct";
import PayPalMessage from "./components/PayPalMessage";
import Products from "./components/Products";
import UserProfile from "./components/UserProfile";

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
                            <Route exact path="/Products" component={Products}/>
                            <Route exact path="/Login" component={Login}/>
                            <Route exact path="/BuyProduct" component={BuyProduct}/>
                            <Route exact path="/PayPalMessage/:messageType/:payPalPaymentID" component={PayPalMessage}/>
                            <Route exact path="/Register" component={Register}/>
                            <Route exact path="/AddInstrument" component={AddInstrument}/>
                            <Route exact path="/EditInstrument/:id" component={EditInstrument}/>
                            <CartPage exact path="/cart" component={CartPage}/>
                            <Route exact path="/Aboutpage" component={AboutPage}/>
                            <Route exact path="/Home" component={Home}/>
                            <Route exact path="/UserProfile" component={UserProfile}/>
                            <Route exact path="/UsersLists" component={UsersLists}/>
                            <Route component={Home}/>

                            <Route exact path="/cart" component={CartPage}/>
                            <Route path="*" component={Products}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </SearchProvider>
        )
    }
}
