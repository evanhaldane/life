import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import kmeans from 'ml-kmeans';

var palettes = {3: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)'], 4: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)'], 5: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)'], 6: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)'], 7: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)'], 8: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)'], 9: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)'], 10: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)'], 11: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)', 'rgb(255,255,153)'], 12: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)', 'rgb(255,255,153)', 'rgb(177,89,40)']}

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
    var ans = kmeans(liveIndices, props.k, {distance:manhattan, tolerance: 1e-2});
    var centers = ans.centroids.map((x)=>x.centroid);
    var initial_colours = initial_grid.map((row)=>row.map((x)=>"#E7E7E7"));
    ans.clusters.forEach((value,index)=> {initial_colours[liveIndices[index][0]][liveIndices[index][1]] = palette[value]});

    this.state = {
      grid: initial_grid,
      indices: indices,
      palette: palette,
      colors: initial_colours,
      centers: centers,
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
    var ans = kmeans(liveIndices, this.state.palette.length, {distance:manhattan, initialization: this.state.centers, tolerance: 1e-2});
    var centers = ans.centroids.map((x)=>x.centroid);
    var newColors = newGrid.map((row)=>row.map((x)=>"#E7E7E7"));
    ans.clusters.forEach((value,index)=> {newColors[liveIndices[index][0]][liveIndices[index][1]] = this.state.palette[value]});
    this.setState({grid: newGrid,
                   colors: newColors,
                   centers: centers});
  }

}

function Row(props){
  const items = props.values.map((value,j)=><div style={{backgroundColor: props.colors[j]}} class="square" value={value}></div>)
  return (<div class="row">{items}</div> 
  );
}

function Board(props){
  const rows = props.grid.map((row_values, i) =><Row values={row_values} colors={props.colors[i]}/>);
  return(
    <div class="board">{rows}</div>
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
registerServiceWorker();

function manhattan([a,b],[c,d]) {
  return Math.abs(a-c) + Math.abs(b-d);
}