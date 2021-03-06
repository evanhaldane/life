import React from 'react';
import { skmeans } from './skmeans/main';
import { palettes } from './palettes';
import { Board } from './Board';

function makeRandomGrid(rows, columns, fraction){
  var grid = []
  for (var i = 0; i < rows; i++){
    grid.push(Array(columns).fill(0).map(z=>1*(Math.random()<fraction)));
  }
  return grid
}

export class Game extends React.Component {
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
    var initial_colors = initial_grid.map((row)=>row.map((x)=>"#E7E7E7"));
    ans.idxs.forEach((value,index)=> {initial_colors[liveIndices[index][0]][liveIndices[index][1]] = palette[value]});

    this.state = {
      grid: initial_grid,
      indices: indices,
      palette: palette,
      colors: initial_colors,
      centers: ans.centroids,
      interval: props.interval
    };
  }

  render() {
    return(
      <div>
        <p>Conway's <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Game of Life</a> with <a href="https://en.wikipedia.org/wiki/K-means_clustering">k-means clustering</a> at each step.</p>
        <Board grid={this.state.grid} colors={this.state.colors}/>
        <p>Made using <a href="https://reactjs.org/">React</a> + <a href="https://www.npmjs.com/package/skmeans">skmeans</a></p>
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
    var newGrid = this.state.grid.map((row,i) =>
      row.map((value,j)=>
        this.nextGeneration(value, this.numberNeighbours(i,j))));
    var liveIndices = this.state.indices.filter(([i,j]) => newGrid[i][j]===1);
    
    // apply k-means clustering, initializing with centroids from last step
    var ans = skmeans(liveIndices, this.state.palette.length, this.state.centers, 100);
    
    // default color for empty cell is grey
    var newColors = newGrid.map((row)=>row.map((x)=>"#E7E7E7"));
    ans.idxs.forEach((value,index)=> {newColors[liveIndices[index][0]][liveIndices[index][1]] = this.state.palette[value]});
    this.setState({grid: newGrid,
                   colors: newColors,
                   centers: ans.centroids});
  }

}