import Mixin from '@helpers/Mixin';

const imagesCollection = Mixin.handleWebpackImport(require.context('../assets/img', true, /\.png/));
const cardsArray = [
  {
    name: 'sheep',
    img: imagesCollection.sheep,
  },
];

export default cardsArray;
