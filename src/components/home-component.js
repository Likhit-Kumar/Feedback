import React, { Component } from 'react';
import ListComments from './list-comments.component';
import AddComment from './add-comment.component';
import DataList from './list-data.component';

export default class Home extends Component {

  constructor(props){
    super(props);
    const sock = new WebSocket('ws://localhost:5001/comment');
    sock.onopen = function() {
        console.log('open');
    };
 
    const self = this;
    sock.onmessage = function(e) {
          const message = JSON.parse(e.data);
          const dataToSend = JSON.stringify(message);
          self.setState({ comment: dataToSend });
    };

    this.state = {
      actions : sock,
      comment : {},
    }
  }

  render() {
    return (
      <div className="container">
        <br/>
        <DataList  {... this.state } />
        < AddComment { ... this.state  }/>
        < ListComments { ... this.state }/>
      </div>
    );
  }
}