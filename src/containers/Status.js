'use strict';

const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from '../actions/index'

const mapStateToProps = state => {
  return { status: state.status };
};

const mapDispatchToProps = dispatch => {
  return {
    getStatus: () => dispatch(getStatus())
  }
};

class ConnectedStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      completed: [],
      queued: []
    };
  }

  componentDidMount() {
    $(this.refs.queued).DataTable();
    this.props.getStatus();
    this.pollStatus();
  }

  pollStatus() {
    setTimeout(() => {
      this.props.getStatus();
      this.pollStatus();
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const c = nextProps.status.completed;
    const q = nextProps.status.queued;
    this.setState({
      completed: c ? c : [],
      queued: q ? q : []
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    //$('#addLinkModal').modal('toggle');
    this.props.postAddFiles(this.state.selectedFiles);
    //this.resetState();
    console.log(this.state.selectedFiles);
  };

  render() {
    //TODO: Add Global Checkbox
    return (
      <div>
        <table ref="queued" id="queued" className="display status-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Downloaded</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.queued.map(function(file) {
              return <tr key={file.name}>
                <td>{file.name}</td>
                <td>{file.humanSize}</td>
                <td>{file.humanDownloadedSize}</td>
              </tr>
            })
          }
          </tbody>
        </table>
        <table id="completed" className="table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.completed.map(function(file) {
              return <tr key={file.name}>
                <td>{file.name}</td>
                <td>{file.humanSize}</td>
              </tr>
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedStatus);