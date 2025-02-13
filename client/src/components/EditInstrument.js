import React, { Component } from "react"
import { Redirect, Link } from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {SERVER_HOST} from "../config/global_constants";

export default class EditInstrument extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            price: "",
            stock: "",
            description: "",
            image: "",
            redirectToDisplayAllInstruments: false
        }
    }

    componentDidMount() {
        // this.inputToFocus.focus()

        axios.get(`${SERVER_HOST}/instruments/${this.props.match.params.id}`)
        .then(res => {
            if(res.data){
                if(res.data.errorMessage){

                }
            }
        })
    }
}
