import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import CarTable from "./CarTable"

import {SERVER_HOST} from "../config/global_constants"


export default class DisplayAllCars extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            cars:[]
        }
    }
    
       
    componentDidMount() 
    {     
        axios.get(`${SERVER_HOST}/cars`)
        .then(res => 
        {
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                {           
                    console.log("Records read")   
                    this.setState({cars: res.data}) 
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })
    }

  
    render() 
    {   
        return (           
            <div className="form-container">
                <div className="table-container">
                    <CarTable cars={this.state.cars} /> 

                    <div className="add-new-car">
                        <Link className="blue-button" to={"/AddCar"}>Add New Car</Link>
                    </div>
                </div>
            </div> 
        )
    }
}