export default {
  storageKeys: {
    authorisation: '__auth',
  },
  timeouts: {},
  events: {
    hashChange: 'hashchange',
    routeChange: 'route-change',
    gameStart: 'game-start',
    gameEnd: 'game-end',
  },
  modalWindow: {
    types: {
      gameDescription: 'modal-description',
      gameEnd: 'modal-game-end',
    },
  },
  games: {
    memoryMatrix: {
      name: 'Matrix Memory',
      id: 'matrix-memory',
      description: 'The “Memory Matrix” simulator will make it easier to absorb new material, work with pronunciation and memorize grammar rules. What is more you will develop logical and analytical skills.',
      rules: 'Colored squares appear on the playing field. Your task will be to remember their location and accurately reproduce when they disappear. The time of appearance of the original value will decrease, and the field will increase. An incorrect answer results in a lower difficulty level and the loss of one of three lives.',
    },
    memoryGame: {
      id: 'memory-game',
      name: 'Memory Game',
      description: 'The memory game is a basic matching game to test the player\'s memory. In a deck of paired cards, the player needs to match each pair to win the game.',
      rules: 'You should turn flipping pairs of cards over. On each move, you will first turn one card over, then a second. If the two cards match, your scores 10 point, the two cards are removed from the game. After this if cards do not match, you are lost 2 point and the cards are turned back over. Good luck!',
    },
  },
};
