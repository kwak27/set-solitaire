import React, { Component } from 'react';
import './Shape.css';

class Shape extends Component {
  render() {
    const {shape, color, shading} = this.props;

    return (
      <div className="Shape-container">
        <div className={`${shape} ${color} ${shading}`} />
      </div>
    );
  }
}


export default Shape;
