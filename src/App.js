import { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
  { "src": "./images/card-1.jpeg", matched: false },
  { "src": "./images/card-2.jpeg", matched: false },
  { "src": "./images/card-3.jpeg", matched: false },
  { "src": "./images/card-4.jpeg", matched: false },
  { "src": "./images/card-5.jpeg", matched: false },
  { "src": "./images/card-6.jpeg", matched: false }
]

function App() {

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(5)
  const [score, setScore] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(5)
    setScore(0)
    setDisabled(false)
    document.querySelector(".result").innerHTML = "";
    document.querySelector(".show-results").classList.remove("show");
  }

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  // compare 2 selected cards 
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if(choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src) {
              return {...card, matched: true};
            }else {
              return card;
            }
          })
        })
        setScore(prevScore => prevScore + 1)
        resetTurn();
      }else {
        setTurns(prevTurns => prevTurns - 1);
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);


  // reset choices and increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setDisabled(false)
  }

  // start the game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  // show game over if the player loses
  useEffect(() => {
    if(turns <= 0) {
      setDisabled(true);
      document.querySelector(".result").innerHTML = "Aww... You lost. Do you want to try again?";
      document.querySelector(".show-results").classList.add("show");
    }
  }, [turns, disabled])

  // show congratulations if player wins
  useEffect(() => {
    if(score === 6) {
      setDisabled(true);
      document.querySelector(".result").innerHTML = "Congratulations! You won! Do you want to play again?";
      document.querySelector(".show-results").classList.add("show");
    }
  }, [score])

  return (
    <div className="App">
      <div className='header'>
        <p>Turns: {turns}</p>
        <h1>Memory Game</h1>
        <p>Score: {score}</p>
      </div>
      <div className='show-results'>
        <p className='result'></p>
        <button onClick={shuffleCards}>New Game</button>
      </div>

      <div className='card-grid'>
        {cards.map(card => (
          <SingleCard 
            key={card.id} 
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
