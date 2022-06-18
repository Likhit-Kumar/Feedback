import React, { Component } from 'react';
import cogoToast from 'cogo-toast';
import moment from 'moment';
import axios from 'axios';

class DataList extends Component {

    constructor(props){
      super(props);
      this.state = {
        UserDataEmail: '',
        UserDataName: ''        
      }
      
    }

    componentDidMount(){
      const jwt = sessionStorage.getItem("jwt-token");
      this.setState({ UserDataEmail : sessionStorage.getItem("UserDataEmail")});
      this.setState({ UserDataName : sessionStorage.getItem("UserDataName")});      
      console.log(this.state.UserDataEmail)

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
              <div className="card-block px-3" style={{paddingBottom: 16}}>
                <h5 className="card-title text-dark" style={{marginTop: '10px', 'fontWeight':'bolder'}}> {this.state.UserDataName} </h5>
                <p className="card-text" style={{fontSize: '16px'}}>{this.state.UserDataEmail }</p>
              </div>
            </div>
          </div>
        </div>
    )

    }
   
}

export default class ListComments extends Component {
  render() {
    return (
      <div className="d-flex flex-column" style={{paddingBottom: 16}}>
      <h3>User Data</h3>
      <DataList/>
    </div>
    );
  }
}