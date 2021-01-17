export default {
  storageKeys: {
    authorisation: '__auth',
  },
  timeouts: {},
  events: {
    hashChange: 'hashchange',
    routeChange: 'route-change',
  },
  games: {
    memoryGame: {
      id: 'memory-game',
      name: 'Memory Game',
      description: 'The memory game is a basic matching game to test the player\'s memory. In a deck of paired cards, the player needs to match each pair to win the game.',
      rules: 'You should turn flipping pairs of cards over. On each move, you will first turn one card over, then a second. If the two cards match, your scores 10 point, the two cards are removed from the game. After this if cards do not match, you are lost 2 point and the cards are turned back over. Good luck!',
    },
  },
};
