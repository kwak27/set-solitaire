import _ from 'lodash';
import React, { Component } from 'react';
import Card from './Card';
import CardHelpers from './CardHelpers';
import './App.css';

class App extends Component {
  constructor() {
    super();
    const deck = CardHelpers.getShuffledDeck();
    this.state = {
      deck: deck.slice(12),
      faceUp: deck.slice(0, 12),
      selected: [],
      status: '',
      timer: 0,
      bestScores: {
        standard: window.localStorage.getItem('bestScores.standard'),
        rapid: window.localStorage.getItem('bestScores.rapid'),
        blitz: window.localStorage.getItem('bestScores.blitz'),
      },
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      this.setState({timer: this.state.timer + 1});
    }, 1000);
  }

  stopTimer = () => {
    this.timer && clearInterval(this.timer);
  }

  resetTimer = () => {
    this.stopTimer();
    this.startTimer();
  }

  handleNewStandardGame = () => {
    const deck = CardHelpers.getShuffledDeck();
    this.setState({faceUp: deck.slice(0, 12), deck: deck.slice(12), selected: [], status: '', timer: 0, type: 'standard'});
    this.resetTimer();
  }

  handleNewRapidGame = () => {
    const deck = CardHelpers.getShuffledDeck().slice(0, 42);
    this.setState({faceUp: deck.slice(0, 12), deck: deck.slice(12), selected: [], status: '', timer: 0, type: 'rapid'});
    this.resetTimer();
  }

  handleNewBlitzGame = () => {
    const deck = CardHelpers.getShuffledDeck().slice(0, 21);
    this.setState({faceUp: deck.slice(0, 12), deck: deck.slice(12), selected: [], status: '', timer: 0, type: 'blitz'});
    this.resetTimer();
  }

  handleClickCard = (card) => {
    const {selected} = this.state;
    if (selected.indexOf(card) > -1) {
      this.setState({selected: selected.filter((s) => s !== card)});
    } else if (selected.length < 3) {
      this.setState({selected: [...selected, card]}, () => this.state.selected.length === 3 && this.handleCheckSet());
    }
  }

  handleCheckSet = () => {
    const {selected, faceUp, deck, timer} = this.state;

    if (CardHelpers.isValidSet(selected)) {
      let nextFaceUp = [...faceUp];
      if (faceUp.length > 12) {
        nextFaceUp = faceUp.filter((f) => selected.indexOf(f) === -1);
      } else {
        const nextCards = deck.slice(0, 3);
        selected.forEach((s, selectedIndex) => {
          const index = nextFaceUp.indexOf(s);
          nextFaceUp[index] = nextCards[selectedIndex];
        });
        nextFaceUp = nextFaceUp.filter((f) => f != null);
      }
      this.setState({
        status: [
          'You found a set!',
          'Nice one!',
          'Sick set!',
          'Great find!',
          'Righteous!',
        ][Math.floor(Math.random() * 5)],
        selected: [],
        faceUp: nextFaceUp,
        deck: deck.slice(3),
      });
    } else {
      this.setState({status: 'That\'s not a set! 30 point penalty', selected: [], timer: timer + 30});
    }
  }

  handleNoMoreSets = () => {
    const {faceUp, deck, timer, type, bestScores} = this.state;
    for (var i = 0; i < faceUp.length; i++) {
      for (var j = i + 1; j < faceUp.length; j++) {
        for (var k = j + 1; k < faceUp.length; k++) {
          if (CardHelpers.isValidSet([faceUp[i], faceUp[j], faceUp[k]])) {
            this.setState({status: 'There\'s still at least one set on the board! 30 point penalty', timer: timer + 30});
            return;
          }
        }
      }
    }

    if (deck.length > 0) {
      this.setState({
        status: 'No sets found, drawing three cards',
        faceUp: [...faceUp, ...deck.slice(0, 3)],
        deck: deck.slice(3),
        selected: [],
      });
    } else {
      this.stopTimer();
      this.setState({status: 'No more sets! You win'});
      if (bestScores[type] == null || timer < bestScores[type]) {
        this.setState({bestScores: {...bestScores, [type]: timer}});
        window.localStorage.setItem(`bestScores.${type}`, timer);
      }
    }
  }

  render() {
    const rows = _.chunk(this.state.faceUp, 4);

    return (
      <div className="App">
        <div className="Section">
          Set
        </div>
        <div className="Section">
          <button onClick={this.handleNewStandardGame}>New Standard Game (81 cards)</button>
          <button onClick={this.handleNewRapidGame}>New Rapid Game (42 cards)</button>
          <button onClick={this.handleNewBlitzGame}>New Blitz Game (21 cards)</button>
        </div>
        <div className="Section">
          {rows.map((row, rIndex) => (
            <div className="Row" key={rIndex}>
              {row.map((card) => (
                <Card
                  handleClickCard={this.handleClickCard.bind(null, card)}
                  selected={this.state.selected.indexOf(card) > -1}
                  key={card}
                  id={card}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="Section">
          <button onClick={this.handleNoMoreSets}>No more sets</button>
        </div>
        <div className="Section FullWidth">
          <div className="Row">
            <span className="LeftText">Cards Left:</span>
            <span className="RightText">{this.state.deck.length}</span>
          </div>
          <div className="Row">
            <span className="LeftText">Score:</span>
            <span className="RightText">{this.state.timer}</span>
          </div>
        </div>
        {this.state.status && (
          <div className="Section">
            <div>
              {this.state.status}
            </div>
          </div>
        )}
        <div className="Section FullWidth">
          <div className="Row">
            <span className="LeftText">Best Score (Standard):</span>
            <span className="RightText">{this.state.bestScores.standard || 'none'}</span>
          </div>
          <div className="Row">
            <span className="LeftText">Best Score (Rapid):</span>
            <span className="RightText">{this.state.bestScores.rapid || 'none'}</span>
          </div>
          <div className="Row">
            <span className="LeftText">Best Score (Blitz):</span>
            <span className="RightText">{this.state.bestScores.blitz || 'none'}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
