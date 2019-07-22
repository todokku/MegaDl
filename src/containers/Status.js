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
  return {status: state.status};
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
      autoWidth: false,
      language: {
        search: '',
        searchPlaceholder: 'Search...'
      },
      columns: [
        {
          title: '#',
          data: 'id',
          width: '12px'
        },
        {
          title: 'Name',
          data: 'name'
        },
        {
          title: 'Size',
          data: 'humanSize',
          width: '96px'
        },
        {
          title: 'Downloaded',
          data: 'humanDownloadedSize',
          width: '96px'
        },
        {
          title: 'Speed',
          data: 'humanSpeed',
          width: '72px'
        }
      ],
      colReorder: {
        fixedColumnsLeft: 2
      }
    });
    $('div.dataTables_filter').appendTo("#status-search");

    this.state.completedTable = $(this.refs.completed).DataTable({
      paging: false,
      info: false,
      select: {style: 'multi'},
      autoWidth: false,
      language: {
        search: '',
        searchPlaceholder: 'Search...'
      },
      columns: [
        {
          title: '#',
          data: 'id',
          width: '12px'
        },
        {
          title: 'Name',
          data: 'name'
        },
        {
          title: 'Size',
          data: 'humanSize',
          width: '96px'
        }
      ],
      colReorder: {
        fixedColumnsLeft: 2
      }
    });

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
    const c = nextProps.status.completed;
    const q = nextProps.status.queued;

    const table = this.state.queuedTable;
    table.clear();
    table.rows.add(q);
    table.draw();

    const table2 = this.state.completedTable;
    table2.clear();
    table2.rows.add(c);
    table2.draw();

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
      <main role="main" className="col-md-9 offset-md-3 col-lg-10 offset-lg-2 status-nav">
        <nav className="navbar sticky-top navbar-expand status-nav">
          <a href="#" className="list-group-item list-group-item-action text-center">Remove</a>
          <a href="#" className="list-group-item list-group-item-action text-center">&uarr;</a>
          <a href="#" className="list-group-item list-group-item-action text-center">&darr;</a>
          <a href="#" className="list-group-item list-group-item-action text-center" style={{minWidth: "160px"}}>Send To
            Top</a>
          <a href="#" className="list-group-item list-group-item-action text-center overflow-hidden"
             style={{minWidth: "160px"}}>Send To Bottom</a>
          <div id="status-search" className="list-group-item list-group-item-action" style={{padding: 0}}/>
        </nav>
        <div className="ml-sm-auto pt-3 px-4">
          <table ref="queued" id="queued" className="status-table table table-striped table-bordered"/>
          <table ref="completed" id="completed" className="status-table table table-striped table-bordered"/>
        </div>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedStatus);