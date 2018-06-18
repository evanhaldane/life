import React from 'react';

export function Row(props){
  const items = props.values.map((value,j)=><div style={{backgroundColor: props.colors[j]}} className="square" value={value} key={j}></div>)
  return (<div className="row">{items}</div> 
  );
}
