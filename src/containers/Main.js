'use strict';

import React, { Component } from "react";

export default class Main extends Component {
  constructor(props) {
    super(props);

    /*this.state = {
      loggedIn: false,
      username: ''
    };*/
  }

  /*handleChange = (event) => {
    console.log(event.target.id + ': ' + event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };*/

  render() {
    return (
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
        MAIN CODE HERE
      </main>
    );
  }
}