'use strict';

import '../scss/login.scss';
import $ from 'jquery'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postLogin } from '../actions/index'

const mapDispatchToProps = dispatch => {
  return {
    postLogin: user => dispatch(postLogin(user))
  }
};

class ConnectedLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: "",
        password: "",
        remember: true
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (event) => {
    console.log(event.target.id + ': ' + event.target.value);
      this.setState({
          [event.target.id]: event.target.value
      });
  };

  handleChangeCheckbox = () => {
    this.setState({
        remember: !this.state.remember
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    $('#loginModal').modal('toggle');
    this.props.postLogin(this.state);
    this.resetState();
  };

  resetState = () => {
    this.setState({
      email: "",
      password: "",
      remember: true
    });
  };

  render() {
    return (
      <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalTitle"
           aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalTitle">Sign in</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" id="loginModalBody">
              <form role="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email"><span className="glyphicon glyphicon-user"/> Username</label>
                  <input type="text" className="form-control" id="email" placeholder="Enter Username" value={this.state.email} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="password"><span className="glyphicon glyphicon-eye-open"/> Password</label>
                  <input className="form-control" id="password" placeholder="Enter password" type="password" value={this.state.password} onChange={this.handleChange}/>
                </div>
                <div className="form-check login-checkbox-container">
                  <input className="form-check-input login-checkbox" type="checkbox" defaultChecked={this.state.remember} onChange={this.handleChangeCheckbox} id="remember" />
                  <label className="form-check-label" htmlFor="rememberMe" onChange={this.handleChange}>
                    Remember Me
                  </label>
                </div>
                <button type="submit" className="btn btn-primary login-btn" disabled={!this.validateForm()}>Sign in</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(ConnectedLogin);