import React, { Component } from "react"
import axios from "axios"
import cogoToast from 'cogo-toast';
import ReCAPTCHA from "react-google-recaptcha";

export default class AuthUser  extends Component {

    constructor(props){
        super(props);
       
        this.onChangeE = this.onChangeE.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeReCaptcha = this.onChangeReCaptcha.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            e: '',
            password: '',
            isVerified: false
        }
      }
      onChangeE(e){
          this.setState({
              e : e.target.value
          });
      }

      onChangePassword(e){
        this.setState({
            password : e.target.value
        });
      }
      onChangeReCaptcha(value) {
        console.log("Captcha value:", value);
        this.setState({
          isVerified: true
        })
      }
    onSubmit(e){
        e.preventDefault();
        const authData = {
            e : this.state.e,
            password : this.state.password
        }
        console.log(authData);
        axios.post('http://localhost:5001/api/users/login', authData)
            .then(res => {
              console.log(res.headers['auth-header']);
              // console.log(res.data);
              sessionStorage.setItem("jwt-token",res.headers['auth-header']);
              sessionStorage.setItem("UserDataEmail",res.data.user.e);              
              sessionStorage.setItem("UserDataName",res.data.user._n);
              sessionStorage.setItem("UserDataMobile",res.data.user.m);              
              sessionStorage.setItem("UserDataMobile",res.data.user.id);

              cogoToast.success('Logged in successfully!', { hideAfter : 5 })
                  .then(() => window.location = '/')
            })
            .catch(err => {
              if(err.response.data.registered === false){
                const {hide} = cogoToast.error('You have not registered, click here to register!', {
                  onClick: () => {
                    hide();
                    window.location = '/register';
                  },
                })
              }
              else
                cogoToast.error('Login failed, please check your credentials & try again!', { hideAfter : 5 })
                .then(() => this.setState({e : '', password : ''}))
            });
        
      }
      render() {
        return (
          <div className="container">
          <h3>Login</h3>
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
              <div className="form-group">
                <input type="password"
                    required
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    minLength = "8"
                    placeholder="Password"
                    className="form-control"
                    >    
                </input>
              </div>
              <ReCAPTCHA
                sitekey="6Leu-2ggAAAAAPb1IwMlEHofw1Vkvg4-C6osOTxk"
                onChange={this.onChangeReCaptcha}
              />              
              <div className="form-group" align="right">
                <input type="submit" disabled={!this.state.isVerified}
                    className="btn btn-dark"
                    value="Login">
                </input>
              </div>
          </form>
          </div>
        );
      }

}