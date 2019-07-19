import React from 'react';
import Nav from './Nav';
import Sidebar from './Sidebar'
import Main from './Main'
import AddLink from './AddLink';
import Login from './Login';

const App = () => (
  <div id="appContainer">
    <Nav />
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <Main />
      </div>
    </div>
    <AddLink />
    <Login />
  </div>
);

export default App;