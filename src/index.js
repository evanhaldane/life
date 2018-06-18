import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { skmeans } from './main';
import { palettes } from './palettes'
class Game extends React.Component {
  constructor(props){
    super(props);
    var indices = [];
    for (var i = 0; i < props.rows; i++){
      for (var j = 0; j < props.columns; j++){
        indices.push([i,j])
      }
    }
    const initial_grid = makeRandomGrid(props.rows,props.columns,props.fraction);
    var palette = palettes[props.k];
    var liveIndices = indices.filter(([i,j]) => initial_grid[i][j]===1);
    var ans = skmeans(liveIndices, props.k);
    var initial_colours = initial_grid.map((row)=>row.map((x)=>"#E7E7E7"));
    ans.idxs.forEach((value,index)=> {initial_colours[liveIndices[index][0]][liveIndices[index][1]] = palette[value]});

    this.state = {
      grid: initial_grid,
      indices: indices,
      palette: palette,
      colors: initial_colours,
      centers: ans.centroids,
      interval: props.interval
    };
  }

  render() {
    return(
      <div>
        <p>Conway's <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Game of Life</a> with <a href="https://en.wikipedia.org/wiki/K-means_clustering">k-means clustering</a> at each step.</p>
      <Board grid={this.state.grid} colors={this.state.colors}/>
      </div>
    )
  }

  componentDidMount() {
    var interval = setInterval(()=> this.update(), this.state.interval);
    this.setState({interval: interval});
  }

  numberNeighbours(i,j) {
    var neighbours = []
    const m = this.state.grid.length
    const n = this.state.grid[0].length
    if (i > 0){
      neighbours.push(this.state.grid[i-1][j]);
      if (j > 0){
        neighbours.push(this.state.grid[i-1][j-1]);
      }
      if (j < n - 1){
        neighbours.push(this.state.grid[i-1][j+1]);
      }
    }
    if (i < m-1){
      neighbours.push(this.state.grid[i+1][j]);
      if (j > 0){
        neighbours.push(this.state.grid[i+1][j-1]);
      }
      if (j < n - 1){
        neighbours.push(this.state.grid[i+1][j+1]);
      }
    }
    if (j > 0){
      neighbours.push(this.state.grid[i][j-1]);
    }
    if (j < n - 1){
      neighbours.push(this.state.grid[i][j+1]);
    }
   
    return neighbours.reduce(
      ( accumulator, currentValue ) => accumulator + currentValue,0
      );
  }

  nextGeneration(value, neighbours){
    if (value === 0 && neighbours === 3){
      return 1
    }
    if (value === 1){
      if (neighbours === 2 || neighbours === 3){
        return 1
      } else {
        return 0
      }
    }
    return 0
  }

  update(){
    var newGrid = this.state.grid.map((row,i)=>
      row.map((value,j)=>
        this.nextGeneration(value, this.numberNeighbours(i,j))));
    var liveIndices = this.state.indices.filter(([i,j]) => newGrid[i][j]===1);
    var ans = skmeans(liveIndices, this.state.palette.length, this.state.centers, 100);
    var newColors = newGrid.map((row)=>row.map((x)=>"#E7E7E7"));
    ans.idxs.forEach((value,index)=> {newColors[liveIndices[index][0]][liveIndices[index][1]] = this.state.palette[value]});
    this.setState({grid: newGrid,
                   colors: newColors,
                   centers: ans.centroids});
  }

}

function Row(props){
  const items = props.values.map((value,j)=><div style={{backgroundColor: props.colors[j]}} className="square" value={value} key={j}></div>)
  return (<div className="row">{items}</div> 
  );
}

function Board(props){
  const rows = props.grid.map((row_values, i) =><Row values={row_values} colors={props.colors[i]} key={i}/>);
  return(
    <div className="board">{rows}</div>
    );
}

function makeRandomGrid(rows, columns, fraction){
  var grid = []
  for (var i = 0; i < rows; i++){
    grid.push(Array(columns).fill(0).map(z=>1*(Math.random()<fraction)));
  }
  return grid
}

//const cartesian = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));

ReactDOM.render(<Game rows={50} columns={50} fraction={0.1} k={9} interval={500}/>, document.getElementById('root'));