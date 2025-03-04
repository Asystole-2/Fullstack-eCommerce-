
import React from 'react'
import {Route, Redirect } from "react-router-dom"

import {ACCESS_LEVEL_USER} from "../config/global_constants"


const LoggedInRoute = ({component: Component, exact, path, ...rest }) =>
    (
        <Route
            exact = {exact}
            path = {path}
            render = {props => sessionStorage.accessLevel >= ACCESS_LEVEL_USER ? <Component {...props} {...rest} /> : <Redirect to="/MainPage"/> }
        />
    )

export default LoggedInRoute
