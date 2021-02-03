export default {
  storageKeys: {
    app: '__app',
  },
  timeouts: {},
  events: {
    hashChange: 'hashchange',
    routeChange: 'route-change',
    gameStart: 'game-start',
    gameEnd: 'game-end',
    storageUpdated: 'storage-updated',
    languageChanged: 'language-changed',
    modalShow: 'modal-show',
  },
  modalWindow: {
    types: {
      gameDescription: 'modal-description',
      gameEnd: 'modal-game-end',
      hotKeys: 'modal-hot-keys',
    },
  },
  games: {
    memoryMatrix: {
      name: 'Matrix Memory',
      id: 'matrix-memory',
      description: 'The “Memory Matrix” simulator helps to increase the volume of short-term memory, accuracy and speed of memorization, spatial working memory, visual memory, voluntary attention, speed of thinking',
      rules: 'Colored squares appear on the playing field. Your task will be to remember their location and accurately reproduce when they disappear. The time of appearance of the original value will decrease, and the field will increase. An incorrect answer results in a lower difficulty level and the loss of 1 lives.',
    },
    memoryGame: {
      id: 'memory-game',
      name: 'Memory Game',
      description: 'The memory game is a basic matching game to test the player\'s memory. In a deck of paired cards, the player needs to match each pair to win the game.',
      rules: 'You should turn flipping pairs of cards over. On each move, you will first turn one card over, then a second. If the two cards match, your scores points, the two cards are removed from the game. If cards do not match, you are lost points and the cards are turned back over. Good luck!',
    },
    charsAndNumbersGame: {
      name: 'Chars and Numbers',
      id: 'chars-and-numbers',
      description: 'Game for the increasing reaction speed  and  logic',
      rules: 'At the beginning of each round, the playing field is divided into 2 parts. After some time, a combination of a letter and a number appears in one of the parts and a question that must be answered as quickly as possible by pressing the yes/no buttons. You can use the arrows on the keyboard.',
    },
    whackAMole: {
      id: 'whack-a-mole',
      name: 'Whack-A-Mole',
      description: 'In order to advance through the levels of this game, the user will have to hit the target mole.',
      rules: 'You have 10 lives in start of the game. If you hit a mole 8 times in a row correctly, the speed of game will increase. But be careful: aim exactly at the mole, overwise you lose 1 live.',
    },
    countSheep: {
      id: 'count-sheep',
      name: 'Count Sheep',
      description: 'This game will help you develop spatial thinking. Play the game and you will count a flock of sheep just by looking at it.',
      rules: 'You need to count the elements on the playing field and choose only one correct answer. Be careful, because you have only 3 opportunities to make a mistake. Good luck!',
    },
  },
  hotKeysInfo: {
    title: 'Use this hot keys to open some pages',
    info: '"ALT + G" - Game list \n "ALT + S" - Statistics \n "ALT + P" - Profile \n "ALT + R" - The Rolling Scopes School Web site \n "ALT + H" - Hot keys instructions',
  },
  baseURL: 'https://brain-wars-backend.herokuapp.com',
};
