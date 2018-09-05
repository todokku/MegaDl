import { SET_USER, SET_FILE_TREE, SET_STATUS } from "../constants/action-types";

const initialState = {
  user: {},
  fileTree: {},
  status: {
    completed: [],
    queued: []
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_FILE_TREE:
      return { ...state, fileTree: action.payload };
    case SET_STATUS:
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

export default rootReducer;