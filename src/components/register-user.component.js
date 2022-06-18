import React, { Component } from "react"
import axios from "axios"
import cogoToast from 'cogo-toast';


export default class RegisterUser extends Component {

    constructor(props){
        super(props);
       
        this.onChangeE = this.onChangeE.bind(this);
        this.onChange_N = this.onChange_N.bind(this);
        this.onChangeM = this.onChangeM.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            e: '',
            _n: '',
            m: '',
            password: ''
        }
      }
      onChangeE(e){
          this.setState({
              e : e.target.value
          });
      }

      onChange_N(e){
        this.setState({
            _n : e.target.value
        });
      }
    
      onChangeM(e){
        this.setState({
            m : e.target.value
        });
      }
      
      onChangePassword(e){
        this.setState({
            password : e.target.value
        });
      }
    onSubmit(e){
        e.preventDefault();
        const user = {
            e : this.state.e, 
            _n : this.state._n,
            m : this.state.m,
            hash : this.state.password
        }
        axios.post('http://localhost:5001/api/users/register', user)
            .then(res => {
              const authData = {
                e : this.state.e,
                password : this.state.password
            }
              axios.post('http://localhost:5001/api/users/login', authData)
              .then(res => {
                console.log(res.headers['auth-header']);
                sessionStorage.setItem("jwt-token",res.headers['auth-header']);
                cogoToast.success('Logged in successfully!', { hideAfter : 3 })
                    .then(() => window.location = '/')
              })
              .catch(err => {

              });
              cogoToast.success('Welcome to the family!', { hideAfter : 3 })
                .then(() => window.location = '/')
              })
            .catch(err => console.log(err));
        
  
    }

      render() {
        return (
          <div className="container">
          <h3>Register</h3>
          <form onSubmit={this.onSubmit} >
              <div className="form-group">
                <input type="text"
                    required
                    value={this.state.e}
                    onChange={this.onChangeE}
                    placeholder="Email"
                    className="form-control"
                    >    
                </input>
              </div>
              <div className="form-group form-inline">
                <input type="text"
                    required
                    value={this.state._n}
                    onChange={this.onChange_N}
                    placeholder="First Name"
                    className="form-control"
                    >    
                </input>
                <input type="text"
                    required
                    value={this.state.m}
                    onChange={this.onChangeM}
                    placeholder="Mobile Number"
                    className="form-control"
                    >    
                </input>
              </div>
              <div className="form-group">
                <input type="text"
                    required
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    minLength = "8"
                    placeholder="Password"
                    className="form-control"
                    >    
                </input>
              </div>
              <div className="form-group" align="right">
                <input type="submit"
                    className="btn btn-dark"
                    value="Register">
                </input>
              </div>
          </form>
          </div>
        );
      }

}