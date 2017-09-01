import _ from 'lodash';

const Colors = ['Green', 'Purple', 'Red'];
const Shapes = ['Diamond', 'Oval', 'Squiggle'];
const Shadings = ['Open', 'Striped', 'Solid'];
const Numbers = [1, 2, 3];

const deck = {};
let id = 0;
Colors.forEach((color) =>
  Shapes.forEach((shape) =>
    Shadings.forEach((shading) =>
      Numbers.forEach((number) => {
        deck[id] = {color, shape, shading, number, id};
        id++;
      }
      )
    )
  )
);

function getShuffledDeck() {
  return _.shuffle(_.range(81));
}

function getCardById(id) {
  return deck[id];
}

function isValidSet(cards) {
  if (cards.length !== 3) {
    return false;
  }

  return ['color', 'shape', 'shading', 'number'].every((attribute) => {
    return (new Set(cards.map((card) => deck[card][attribute]))).size !== 2;
  });
}


export default {
  getShuffledDeck,
  getCardById,
  isValidSet,
};
