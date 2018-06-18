import React, { Component } from 'react';
import Janes from './Janes.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>- JANE'S PROGRAM -</h1>
        </header>
        <Janes/>
        <p className="App-intro">
          HTML port by Peter Hirschberg. Written in React/JSX, this is a port of
          an old Atari computer game originally created by the famed
          Douglas Crockford. 
        </p>
      </div>
    );
  }
}

export default App;
