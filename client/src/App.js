import React, {Component} from "react";
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import Register from "./components/Register";
import AddInstrument from "./components/AddInstrument";
import Admin from "./components/Admin";
import "./css/App.css";
import EditInstrument from "./components/EditInstrument";
import LoggedInRoute from "./components/LoggedInRoute";
import {ACCESS_LEVEL_GUEST} from "./config/global_constants";

if (typeof sessionStorage.accessLevel === "undefined")
{
    sessionStorage.name = "GUEST"
    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;
}
export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/MainPage" component={MainPage}/>
                        <Route exact path="/Login" component={Login}/>
                        <LoggedInRoute exact path="/Register" component={Register}/>
                        <LoggedInRoute exact path="/AddInstrument" component={AddInstrument}/>
                        <LoggedInRoute exact path="/EditInstrument/:id" component={EditInstrument}/>
                        <Route component={MainPage}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
