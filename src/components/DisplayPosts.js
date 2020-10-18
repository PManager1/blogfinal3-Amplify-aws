import React, {Component} from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'

export default class DisplayPosts extends Component{

    componentDidMount = async() =>{
        this.getPosts()
    }

    getPosts = async () => {
        const result = await API.graphql (graphqlOperation(listPosts))
        console.log(' results =', JSON.stringify(result.data.listPosts.items)) 
    };

     response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials" : true,
        },
        body: "...",
        statusCode: 200
    }

    render(){
        return (
            <div> Display Posts </div>
        )
    }

};
