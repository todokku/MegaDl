'use strict';

import React, { Component } from "react";
import '../scss/nav.scss'
import {postLogout} from "../actions";
import connect from "react-redux/es/connect/connect";

const mapStateToProps = state => {
  return { user: state.user };
};

const mapDispatchToProps = dispatch => {
  return {
    postLogout: () => dispatch(postLogout())
  }
};

function LoggedInView(props) {
  return (
    <ul className="navbar-nav px-3">
      <li className="nav-item active text-nowrap">
        <a className="nav-link">{props.user.name}</a></li>
      <li className="nav-item text-nowrap">
        <a className="nav-link" onClick={props.postLogout} href="#">Logout</a>
      </li>
    </ul>
  );
}

function LoggedOutView(props) {
  return (
    <ul className="navbar-nav px-3">
      <li className="nav-item text-nowrap">
        <a className="nav-link" data-toggle="modal" data-target="#loginModal" href="#">Login</a>
      </li>
    </ul>
  );
}

class ConnectedNav extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      loggedIn: !!Object.keys(props.user).length,
      user: props.user
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loggedIn: !!nextProps.user.name,
      user: nextProps.user
    });
  }

  render() {
    return (
      <nav className="navbar navbar-dark sticky-top navbar-expand bg-dark custom-navbar">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">MegaDL</a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item text-nowrap">
                  <a className="nav-link" data-toggle="modal" data-target="#addLinkModal" href="#">Add...</a>
                </li>
              </ul>
              { this.state.loggedIn ?
                <LoggedInView user={this.state.user} postLogout={this.props.postLogout}/>
                :
                <LoggedOutView/>
              }
            </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedNav);