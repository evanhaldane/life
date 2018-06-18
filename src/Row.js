import React from 'react';

export function Row(props){
  
	return (
		<div className="row">
			{props.values.map((value,j) => (
				<div 
					style={{backgroundColor: props.colors[j]}}
					className="square"
					value={value}
					key={j}>
				</div>
			))}
		</div>
		);
}
