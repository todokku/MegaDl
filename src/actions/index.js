import axios from 'axios';

import {SET_USER, SET_FILE_TREE, SET_STATUS} from '../constants/action-types';

export const setUser = user => ({ type: SET_USER, payload: user });
export const setFileTree = fileTree => ({ type: SET_FILE_TREE, payload: fileTree });
export const setStatus = status => ({ type: SET_STATUS, payload: status });

export let postLogin = (user) => {
  console.log(user);
  return dispatch => {
    return axios.post('/user/login', user).then(
      response => {
        console.log(response);
        dispatch(setUser(response.data));
      },
      err => {
        console.log(err);
        //TODO: Handle errors
      }
    );
  }
};

export let postLogout = () => {
  return dispatch => {
    return axios.get('/user/logout').then(
      response => {
        console.log(response);
        dispatch(setUser({}));
      },
      err => {
        console.log(err);
        //TODO: Handle errors
      }
    );
  }
};

export const postLoadLink = link => {
  return dispatch => {
    return axios.post('/download/load', {'link': link}).then(
      response => {
        console.log(response);
        dispatch(setFileTree(response.data));
      },
      err => {
        console.log(err);
        //TODO: Handle errors
      }
    );
  }
};

export const postAddFiles = files => {
  return dispatch => {
    return axios.post('/download/add', {'files': files}).then(
      response => {
        console.log(response)
      },
      err => {
        console.log(err);
        // TODO: Handle errors
      }
    );
  }
};

export const getStatus = () => {
  return dispatch => {
    return axios.get('/download/status').then(
      response => {
        console.log(response);
        dispatch(setStatus(response.data));
      },
      err => {
        console.log(err);
        // TODO: Handle errors
      }
    );
  }
};