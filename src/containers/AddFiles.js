'use strict';

import $ from 'jquery'
import 'jquery.fancytree/dist/skin-win8-n/ui.fancytree.min.css'
import 'jquery.fancytree/dist/modules/jquery.fancytree.table'
import { createTree } from 'jquery.fancytree'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postAddFiles } from '../actions/index'

const mapDispatchToProps = dispatch => {
  return {
    postAddFiles: files => dispatch(postAddFiles(files))
  }
};

class ConnectedAddFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFiles: [],
      fileTree: props.fileTree
    };
  }

  componentDidMount() {
    this.createFancyTree(this, this.state.fileTree);
  }

  componentWillReceiveProps(nextProps) {
    this.resetState();
    this.setState({
      fileTree: nextProps.fileTree
    });

    $("#tree").fancytree("destroy");
    this.createFancyTree(this, nextProps.fileTree);
  }

  createFancyTree(comp, fileTree) {
    createTree('#tree', {
      checkbox: true,
      selectMode: 3,
      tooltip: true,
      source: fileTree,
      extensions: ['table'],
      table: {
        checkboxColumnIdx: 0,
        indentation: 16,
        nodeColumnIdx: 1
      },
      createNode: function(event, data) {
        const node = data.node,
          $tdList = $(node.tr).find(">td");

        // Make the title cell span the remaining columns if it's a folder:
        if( node.isFolder() ) {
          $tdList.eq(1)
            .prop("colspan", 3)
            .nextAll().remove();
          return;
        }

        $tdList.eq(2).text(node.data.humanSize);
      },
      select: function(event, data) {
        comp.setState({selectedFiles:
          data.tree.getSelectedNodes().filter(
            function(item) {
              return !item.data.directory;
            }).map(
            function(item) {
              return item.data;
            })
        });
      }
    });

    $("#tree").fancytree("getTree").visit(function(node) {
      node.setSelected(true);
    });
  }

  validate() {
    return this.state.selectedFiles.length > 0;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    //$('#addLinkModal').modal('toggle');
    this.props.postAddFiles(this.state.selectedFiles);
    //this.resetState();
    console.log(this.state.selectedFiles);
  };

  resetState = () => {
    this.setState({
      tree: {},
      selectedFiles: []
    });
  };

  render() {
    //TODO: Add Global Checkbox
    return (
      <div>
        <table id="tree" className="table table-sm table-fileTree">
          <thead>
            <tr>
              <th className="checkboxCol"> </th>
              <th className="nameCol">Name</th>
              <th className="sizeCol">Size</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <div>
          <span className="btn selected-download">Selected: {this.state.selectedFiles.length}</span>
          <button className="btn btn-primary btn-download" disabled={!this.validate()} onClick={this.handleSubmit}>Download</button>
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(ConnectedAddFiles);