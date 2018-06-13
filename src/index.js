import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      grid: makeRandomGrid(props.rows,props.columns,props.fraction)
    };
  }

  render() {
    return(
      <Board grid={this.state.grid}/>
    )
  }
}


function Row(props){
  const items = props.row.map((value,j)=><div class="square" value={value}></div>)
  return (<div class="row">{items}</div> 
  );
}


function Board(props){
  const rows = props.grid.map((row, i) =><Row row={row}/>);
  return(
    <div class="board">{rows}</div>
    );
}



ReactDOM.render(<Game rows={50} columns={50} fraction={0.1}/>, document.getElementById('root'));
registerServiceWorker();

function makeRandomGrid(rows, columns, fraction){
  var grid = []
  for (var i = 0; i < rows; i++){
    grid.push(Array(columns).fill(0).map(z=>1*(Math.random()<fraction)));
  }
  return grid
}

const cartesian = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
/*
function numberNeighbours(i,j) {
  var neighbours = []
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
    ( accumulator, currentValue ) => accumulator + currentValue,0
  );
}
*/