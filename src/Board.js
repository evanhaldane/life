import React from 'react';
import { Row } from './Row';

export function Board(props){
  const rows = props.grid.map((row_values, i) =><Row values={row_values} colors={props.colors[i]} key={i}/>);
  return(
    <div className="board">{rows}</div>
    );
}