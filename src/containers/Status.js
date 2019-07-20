'use strict';

const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');
require('datatables.net-colreorder-bs4');
require('datatables.net-rowreorder-bs4');
require('datatables.net-select-bs4');

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
      queued: [],
      queuedTable: {},
      completedTable: {}
    };
  }

  componentDidMount() {
    this.state.queuedTable = $(this.refs.queued).DataTable({
      paging: false,
      info: false,
      select: {style: 'multi'},
      columns: [
        {
          title: 'Name',
          data: 'name'
        },
        {
          title: 'Size',
          data: 'humanSize',
          size: '20'
        },
        {
          title: 'Downloaded',
          data: 'humanDownloadedSize',
          size: '20'
        },
      ]
    });

    this.props.getStatus();
    this.pollStatus();
  }

  pollStatus() {
    setTimeout(() => {
      this.props.getStatus();
      this.pollStatus();
    }, 100000);
  }

  componentWillReceiveProps(nextProps) {
    const c = nextProps.status.completed;
    const q = nextProps.status.queued;

    const table = this.state.queuedTable;
    table.clear();
    table.rows.add(q);
    table.draw();

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
        <table ref="queued" id="queued" className="status-table table table-striped table-bordered" />
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