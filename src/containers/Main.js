'use strict';

import React, { Component } from "react";
import Status from "./Status";

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main role="main" className="col-md-9 offset-md-3 col-lg-10 offset-lg-2 ml-sm-auto pt-3 px-4">
        <Status />
      </main>
    );
  }
}