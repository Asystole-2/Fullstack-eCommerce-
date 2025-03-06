import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import MainPage from "./components/MainPage"
import Login from "./components/Login"
import Register from "./components/Register"
import AddInstrument from "./components/AddInstrument"
import "./css/App.css"
import EditInstrument from "./components/EditInstrument"
import {SearchProvider} from "./components/SearchContext"
import CartPage from './components/CartPage'
import Navbar from "./components/Navbar"
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"
import LoggedInRoute from "./components/LoggedInRoute"
import AdminRoute from "./components/AdminRoute"
import BuyProduct from "./components/BuyProduct";
import PayPalMessage from "./components/PayPalMessage";

if (typeof sessionStorage.accessLevel === "undefined") {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
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
                            <Route exact path="/BuyProduct" component={BuyProduct}/>
                            <Route exact path="/PayPalMessage/:messageType/:payPalPaymentID" component={PayPalMessage}/>
                            <Route exact path="/Register" component={Register}/>
                            <AdminRoute exact path="/AddInstrument" component={AddInstrument}/>
                            <AdminRoute exact path="/EditInstrument/:id" component={EditInstrument}/>
                            <Route exact path="/cart" component={CartPage}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </SearchProvider>
        )
    }
}
