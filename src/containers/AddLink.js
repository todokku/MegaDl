'use strict';

import '../scss/addLink.scss'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddFiles from './AddFiles';
import { postLoadLink } from '../actions/index'

const mapStateToProps = state => {
  return { fileTree: state.fileTree };
};

const mapDispatchToProps = dispatch => {
  return {
    postLoadLink: link => dispatch(postLoadLink(link))
  }
};

class ConnectedAddLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      link: '',
      fileTree: {},
      loaded: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fileTree: nextProps.fileTree,
      loaded: !(Object.keys(nextProps.fileTree).length === 0 && nextProps.fileTree.constructor === Object)
    });
  }

  validateForm() {
    return this.state.link.length > 0;
  }

  handleChange = (event) => {
    console.log(event.target.id + ': ' + event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    //$('#addLinkModal').modal('toggle');
    this.props.postLoadLink(this.state.link);
    //this.resetState();
  };

  // TODO: jquery modal onClose needs to reset state for this and login
  resetState = () => {
    this.setState({
      link: '',
      fileTree: {},
      loaded: false
    });
  };

  render() {
    return (
      <div className="modal fade" id="addLinkModal" tabIndex="-1" role="dialog" aria-labelledby="addLinkTitle"
           aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="AddLinkTitle">Add Link</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" id="addLinkBody">
              <form role="form" onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <input type="text" className="form-control" id="link" placeholder="Enter Mega Link" value={this.state.link} onChange={this.handleChange}/>
                  <span className="input-group-btn ml-2">
                    <button type="submit" className="btn btn-primary login-btn" disabled={!this.validateForm()}>Load</button>
                  </span>
                </div>
              </form>
              { this.state.loaded && <AddFiles fileTree={this.state.fileTree} /> }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedAddLink);