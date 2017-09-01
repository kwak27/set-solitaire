import React, { Component } from 'react';
import Shape from './Shape';
import CardHelpers from './CardHelpers';
import './Card.css';

class Card extends Component {
  render() {
    const {handleClickCard, selected, id} = this.props;
    const {number, ...shapeProps} = CardHelpers.getCardById(id);
    return (
      <div className={`Card ${selected ? 'Selected' : ''}`} onClick={handleClickCard}>
        {[...Array(number)].map((_, index) =>  <Shape {...shapeProps} key={index} />)}
      </div>
    );
  }
}

export default Card;
