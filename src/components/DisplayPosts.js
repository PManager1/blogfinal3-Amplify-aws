import React, {Component} from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { onCreatePost, onDeletePost, onUpdatePost, onCreateComment, onCreateLike } from '../graphql/subscriptions'
import DeletePost from './DeletePost'
import EditPost from './EditPost'


export default class DisplayPosts extends Component{

    state = {
        posts: []
    }
    componentDidMount = async() =>{
        this.getPosts()
    }

    getPosts = async () => {
        const result = await API.graphql (graphqlOperation(listPosts))
      
        this.setState ({ posts: result.data.listPosts.items})
    };


        createPostListener = API.graphql(graphqlOperation(onCreatePost))
    .subscribe({
        next: postData => {
             const newPost = postData.value.data.onCreatePost
             const prevPosts = this.state.posts.filter( post => post.id !== newPost.id)

             const updatedPosts = [newPost, ...prevPosts]

             this.setState({ posts: updatedPosts})
        }
    })

        deletePostListener = API.graphql(graphqlOperation(onDeletePost))
       .subscribe({
            next: postData => {
                  
               const deletedPost = postData.value.data.onDeletePost
               const updatedPosts = this.state.posts.filter(post => post.id !== deletedPost.id)
               this.setState({posts: updatedPosts})
            }
       })

    updatePostListener = API.graphql(graphqlOperation(onUpdatePost))
       .subscribe({
            next: postData => {
                 const { posts } = this.state
                 const updatePost = postData.value.data.onUpdatePost
                 const index = posts.findIndex(post => post.id === updatePost.id) //had forgotten to say updatePost.id!
                 const updatePosts = [
                     ...posts.slice(0, index),
                    updatePost,
                    ...posts.slice(index + 1)
                   ]

                   this.setState({ posts: updatePosts})

            }
       })

 
    render(){
        const { posts } = this.state; 
        return posts.map((post)  =>{
            return (
                <div className="posts" style={rowStyle} key={post.id}> 
                    <h1 > {post.postTitle} </h1>
                    <span style={{ fontStyle: "italic", color: "#0ca5e297"  }}> 
                         wrote by:  {post.postOwnerUsername}
                         <time style={{ fontStyle: "italic" }}> on: { new Date(post.createdAt).toDateString()  }  </time>
                    </span>
                    <p> {post.postBody} </p>


                <span>
                <DeletePost data={post}/> <EditPost {...post} />   

                </span>
                </div>
            )
        })

    }

};

const rowStyle = {
    background: '#f4f4f4', 
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px', 
}