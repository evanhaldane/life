import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';




class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}




var column = new Uint8Array(100)
var fraction = 0.1;
var grid = new Array(100).fill(0).map(z=>crypto.getRandomValues(column).map(x=>1*(x<fraction*256)))

const cartesian = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));

function numberNeighbours(i,j) {
  neighbours = []
  const m = grid.length
  const n = grid[0].length
  if (i > 0){
    neighbours.push(grid[i-1][j]);
    if (j > 0){
      neighbours.push(grid[i-1][j-1]);
    }
    if (j < n - 1){
      neighbours.push(grid[i-1][j+1]);
    }
  }
  if (i < m-1){
    neighbours.push(grid[i+1][j]);
    if (j > 0){
      neighbours.push(grid[i+1][j-1]);
    }
    if (j < n - 1){
      neighbours.push(grid[i+1][j+1]);
    }
  }
  if (j > 0){
    neighbours.push(grid[i][j-1]);
  }
  if (j < n - 1){
    neighbours.push(grid[i][j+1]);
  }
 
 return neighbours.reduce(
  ( accumulator, currentValue ) => accumulator + currentValue,0);
}

