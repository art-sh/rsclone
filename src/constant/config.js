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
    matrixMemoryGame: {
      name: 'Matrix Memory',
      id: 'matrix-memory',
      description: 'The “Memory Matrix” simulator will make it easier to absorb new material, work with pronunciation and memorize grammar rules. What is more you will develop logical and analytical skills.',
      rules: 'Colored squares appear on the playing field. Your task will be to remember their location and accurately reproduce when they disappear. The time of appearance of the original value will decrease, and the field will increase. An incorrect answer results in a lower difficulty level and the loss of one of three lives.',
    },
  }
};
