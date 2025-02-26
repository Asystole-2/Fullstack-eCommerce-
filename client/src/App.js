import React, {Component} from "react";
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import Register from "./components/Register";
import AddInstrument from "./components/AddInstrument";
import Admin from "./components/Admin";
import "./css/App.css";
import EditInstrument from "./components/EditInstrument";
import { SearchProvider } from "./components/SearchContext";
import Products from "./components/Products";
import Navbar from "./components/Navbar";

export default class App extends Component {
    render() {
        return (
            <SearchProvider>
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/MainPage" component={MainPage}/>
                        <Route exact path="/Login" component={Login}/>
                        <Route exact path="/Register" component={Register}/>
                        <Route exact path="/AddInstrument" component={AddInstrument}/>
                        <Route exact path="/EditInstrument/:id" component={EditInstrument}/>
                        <Route component={MainPage}/>
                    </Switch>
                </div>
            </BrowserRouter>
    </SearchProvider>
        );
    }
}
