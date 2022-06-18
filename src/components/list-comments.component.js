import React, { Component } from 'react';
import cogoToast from 'cogo-toast';
import moment from 'moment';
import axios from 'axios';

class Comment extends Component {

    constructor(props){
      super(props);
      this.state = {
        publisher : '',        
      }
    }

    onReplyClickHandler = (e) => {

      this.setState({
        curr_parent:e.target.id
      });
      this.setState({
        curr_name:"",
        curr_comment:""
      })

  
      console.log("I am clicked !",e.target.id);
    }
  
    recursiveFetch(pid,margin,ind){
      let found = 0;
  
      for (let i = 0; i < this.state.data.length; i++) {
        if(this.state.data[i].parent_comment_id===pid){
          found=1;
  
          let dd = (
      
            <div className="card card-default mb-4" key={this.state.data[i]._id} style={{marginLeft:margin}}>
                <div className="card-header">By <b>{this.state.data[i].user}</b> on <i>{this.state.data[i].date}</i></div>
                <div className="card-body">{this.state.data[i].content}</div>
                <div className="card-footer" align="right"><button type="button" onClick={this.onReplyClickHandler} className="btn btn-secondary reply" id={this.state.data[i]._id}>Reply</button></div>
            </div>
          )
  
          this.setState(prevState => {
            // console.log(prevState.comments);
            let comments = {...prevState.comments}
            comments[ind].push(dd);
            
            return {comments}
          });
  
          this.recursiveFetch(this.state.data[i]._id,margin+48,ind);

        }
        
      }
  
      if(found===0){
        return;
      }
    }
    componentDidMount(){
      const jwt = sessionStorage.getItem("jwt-token");
      if(jwt === null){
        console.log('not logged in');
      }
      else{
        const headers = { headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "auth-header": jwt,
          }
        }
        }
    }

    render() {      
      return (
        <div className="card">
          <div className="row">
            <div className="col-md-10 px-3">
              <div className="card-block px-3">
                <h5 className="card-title text-dark" style={{marginTop: '10px', 'fontWeight':'bolder'}}>{this.props.comment.user._n} </h5>
                <p className="card-text" style={{fontSize: '16px'}}>{this.props.comment.content }</p>
                <p className="text-muted" style={{fontSize: '13px'}}><img src={process.env.PUBLIC_URL + '/logos/clock.png'} style={{width: '13px', height: '13px'}} />&nbsp;&nbsp;{moment(Date.parse(this.props.comment.createdAt)).fromNow()}</p>
                
              </div>
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

  componentDidMount() { 
    const jwt = sessionStorage.getItem("jwt-token");
    
    axios.get('http://localhost:5001/api/comments/')
      .then(resp => this.setState({ comments : resp.data }))
      .catch(err => console.log(err))
    }

  componentWillReceiveProps(nextProps){
    
    const data = JSON.parse(nextProps.comment);
    if(data.type === "comment"){
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