import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Game } from './Game'

ReactDOM.render(<Game rows={50} columns={50} fraction={0.1} k={9} interval={500}/>, document.getElementById('root'));