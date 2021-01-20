import Mixin from '@helpers/Mixin';

const imagesCollection = Mixin.handleWebpackImport(require.context('../img', true, /\.png/));
const cardsArray = [
  {
    name: 'shell',
    img: imagesCollection.blueshell,
  },
  {
    name: 'star',
    img: imagesCollection.star,
  },
  {
    name: 'bobomb',
    img: imagesCollection.bobomb,
  },
  {
    name: 'mario',
    img: imagesCollection.mario,
  },
  {
    name: 'luigi',
    img: imagesCollection.luigi,
  },
  {
    name: 'peach',
    img: imagesCollection.peach,
  },
  {
    name: '1up',
    img: imagesCollection['1up'],
  },
  {
    name: 'mushroom',
    img: imagesCollection.mushroom,
  },
  {
    name: 'thwomp',
    img: imagesCollection.thwomp,
  },
  {
    name: 'bulletbill',
    img: imagesCollection.bulletbill,
  },
  {
    name: 'coin',
    img: imagesCollection.coin,
  },
  {
    name: 'goomba',
    img: imagesCollection.goomba,
  },
];

export default cardsArray;
