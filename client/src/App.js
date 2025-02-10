import React, {Component} from "react";
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import Register from "./components/Register";
import "./css/App.css";

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/MainPage" component={MainPage}/>
                        <Route exact path="/Login" component={Login}/>
                        <Route exact path="/Register" component={Register}/>
                        <Route component={MainPage}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
