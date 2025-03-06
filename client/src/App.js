import React, {Component} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import Register from "./components/Register";
import AddInstrument from "./components/AddInstrument";
import "./css/App.css";
import EditInstrument from "./components/EditInstrument";
import {SearchProvider} from "./components/SearchContext";
import CartPage from './components/CartPage'; // Adjust path if needed
import Navbar from "./components/Navbar";
import {ACCESS_LEVEL_GUEST} from "./config/global_constants";

if (typeof sessionStorage.accessLevel === "undefined") {
    sessionStorage.name = "GUEST"
    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;

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
                            <Route exact path="/AddInstrument" component={AddInstrument}/>
                            <Route exact path="/EditInstrument/:id" component={EditInstrument}/>
                            <Route exact path="/cart" component={CartPage}/>
                            <Route component={MainPage}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </SearchProvider>
        );
    }
}
