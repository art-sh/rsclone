const path = require('path');

const getFullPath = (currentPath) => path.resolve(__dirname, `../${currentPath}`);

export const cardsArray = [
  {
    name: 'shell',
    img: getFullPath('img/blueshell.png'),
  },
  {
    name: 'star',
    img: getFullPath('img/star.png'),
  },
  {
    name: 'bobomb',
    img: getFullPath('img/bobomb.png'),
  },
  {
    name: 'mario',
    img: getFullPath('img/mario.png'),
  },
  {
    name: 'luigi',
    img: getFullPath('img/luigi.png'),
  },
  {
    name: 'peach',
    img: getFullPath('img/peach.png'),
  },
  {
    name: '1up',
    img: getFullPath('img/1up.png'),
  },
  {
    name: 'mushroom',
    img: getFullPath('img/mushroom.png'),
  },
  {
    name: 'thwomp',
    img: getFullPath('img/thwomp.png'),
  },
  {
    name: 'bulletbill',
    img: getFullPath('img/bulletbill.png'),
  },
  {
    name: 'coin',
    img: getFullPath('img/coin.png'),
  },
  {
    name: 'goomba',
    img: getFullPath('img/goomba.png'),
  },
];
