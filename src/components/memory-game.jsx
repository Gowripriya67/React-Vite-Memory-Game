
import React, { useEffect, useState } from 'react';

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState(""); // New state for feedback messages

  // Example image URLs (replace these URLs with your own or import images directly)
  const imageUrls = [
    "https://i.pinimg.com/474x/aa/a7/ed/aaa7edf25aa851af618efc176b9b2add.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQQYsvfeef6TkYHhAoVNMPXWWAGgSPnO9oSSAfXlZInauExb0m_7melKXjfxqaH5ry7N8&usqp=CAU",
    "https://i.pinimg.com/474x/52/41/60/524160febca080fc00f1eb48740e9a87.jpg",
    "https://yt3.googleusercontent.com/gH7Ik5TvxpYAPqdYMJm2njGVBlvNNpPa6m3rMDeopiteDUPL37_jnL4LkwsUCrj61b7v1CZ_=s900-c-k-c0x00ffffff-no-rj",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX62Udxj8Xq4p00FJZtk-98FLNs1Bqr5hcYysuNv6nSriHJETrr6EzafsA8e1-Gsw0raw&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhvKRZFjjmO2JNf_0_OVDD6--POAzey4bhebsZbmOxuIeGlPAyhyk0_a5MnE2Ccz1cWFc&usqp=CAU",
    "https://media.tenor.com/RmJ0UocFElQAAAAe/bitmoji-wave.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIx7DSuPJ6OYKx8NjZOGIOwuaYzZ8RvITlnOq6ivQr9BvSxOOYBq_yCxatrV9Ic56BrKQ&usqp=CAU",
    // Add more images if needed based on gridSize
  ];

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const selectedImages = imageUrls.slice(0, pairCount);
    const shuffleCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((image, index) => ({ id: index, image }));
    setCards(shuffleCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setMessage(""); // Reset message on game initialization
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].image === cards[secondId].image) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
      setMessage("Matched!"); // Message for a match
      setTimeout(() => setMessage(""), 1000); // Clear after 1 second
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won) return;
    if (solved.includes(id)) {
      setMessage("This card is already matched!"); // Message for already solved card
      setTimeout(() => setMessage(""), 1000); // Clear after 1 second
      return;
    }

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      {/* Input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">Grid Size: (max 10)</label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-gray-100 rounded px-2 py-1 text-black"
        />
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
              isFlipped(card.id) ? (isSolved(card.id) ? "bg-green-500" : "bg-blue-500") : "bg-gray-300"
            }`}
          >
            {isFlipped(card.id) ? (
              <img src={card.image} alt="card" className="w-full h-full object-cover rounded-lg" />
            ) : (
              "?"
            )}
          </div>
        ))}
      </div>

      {/* Result */}
      {won && <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">You Won!</div>}

      {/* Message */}
      {message && <div className="mt-2 text-lg font-semibold text-yellow-400">{message}</div>}

      {/* Reset/Play Again Button */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;

