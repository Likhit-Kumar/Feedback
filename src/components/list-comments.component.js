import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Comment extends Component {

    constructor(props){
      super(props);
      this.upvotes = React.createRef();
      this.downvotes = React.createRef();
      this.handleUpvoteDownvote = this.handleUpvoteDownvote.bind(this);

      this.state = {
        upvoted : false,
        downvoted : false
      }

    }

    handleUpvoteDownvote(e){
      console.log(e.target.name);
      console.log(this.props);
      const json = { type: e.target.name };
      json.data = this.props;
      if(e.target.name === "upvote"){
        if(this.state.downvoted){
          json.data.comment.downvotes--;
          this.setState({downvoted : false});
        }
        json.data.comment.upvotes++;
        this.setState({upvoted : true});  
      }
      else {
        if(this.state.upvoted){
          json.data.comment.upvotes--;
          this.setState({upvoted : false});
        }
        json.data.comment.downvotes++;
        this.setState({downvoted : true});     
      }
      console.log(json);
      this.props.socket.send(JSON.stringify(json));
      const jwt = sessionStorage.getItem("jwt-token");
      if(jwt === null){
        console.log('not logged in');
        window.location = '/login';
      }
      const headers = { headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "auth-header": jwt,
        }
      }
      // sync with db/redis
      axios.put('http://localhost:5000/api/comments/update', json.data.comment, headers)
        .then(res => { 
          console.log(res);
          
        })
        .catch(err => console.log(err));
      }

    render() {
      return (
      <div>
        <div className="p-1"><h5>{this.props.comment.user.firstName} {this.props.comment.user.lastName}</h5></div>
        <div>
        <h6>{this.props.comment.content }</h6>
        <div align="right">  
       <div><span ref={this.upvotes} >{this.props.comment.upvotes}</span> <button name="upvote" disabled={this.state.upvoted} onClick={this.handleUpvoteDownvote}>Upvote</button></div>
        <div><span ref={this.downvotes}>{this.props.comment.downvotes}</span>  <button name="downvote" disabled={this.state.downvoted} onClick={this.handleUpvoteDownvote}>Downvote</button></div>
        </div>
        </div>
       
      </div>
    )

    }
   
}

export default class ListComments extends Component {

  constructor(props){
    super(props);
    this.state = { comments: [] }
  }

  componentDidMount(){
    axios.get('http://localhost:5000/api/comments/')
      .then(resp => this.setState({ comments : resp.data }))
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps){
    
    const data = JSON.parse(nextProps.comment);
    console.log(data.data);
    if(data.type === "upvote" || data.type === "downvote"){
      let cloneComments = [...this.state.comments]
      const foundIndex = cloneComments.findIndex(x => x._id == data.data.comment._id );
      console.log(foundIndex)
      cloneComments[foundIndex] = data.data.comment

      this.setState({ comments : cloneComments });
    }
    else if(data.type === "comment"){
      this.setState({ comments : [data.data, ...this.state.comments] })
    }
  } 

  commentList() {  
    return this.state.comments.map(currentcomment => {
      return <Comment comment={currentcomment} socket={this.props.actions} key={currentcomment._id}/>;
    })
  }
  render() {
    return (
      <div className="d-flex flex-column">
      <h3>Comments</h3>
        { this.commentList() }
     </div>
    );
  }
}