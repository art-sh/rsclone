import Mixin from '@helpers/Mixin';

const imagesCollection = Mixin.handleWebpackImport(require.context('../assets/img', true, /\.png/));
const cardsArray = [
  {
    name: 'apple',
    img: imagesCollection.apple,
  },
  {
    name: 'ball',
    img: imagesCollection.ball,
  },
  {
    name: 'bee',
    img: imagesCollection.bee,
  },
  {
    name: 'compass',
    img: imagesCollection.compass,
  },
  {
    name: 'elephant',
    img: imagesCollection.elephant,
  },
  {
    name: 'four',
    img: imagesCollection.four,
  },
  {
    name: 'flower',
    img: imagesCollection.flower,
  },
  {
    name: 'leaf',
    img: imagesCollection.leaf,
  },
  {
    name: 'music',
    img: imagesCollection.music,
  },
  {
    name: 'sneakers',
    img: imagesCollection.sneakers,
  },
  {
    name: 'star',
    img: imagesCollection.star,
  },
  {
    name: 'turtle',
    img: imagesCollection.turtle,
  },
];

export default cardsArray;
