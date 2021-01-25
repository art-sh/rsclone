const assert = require('chai').assert;
import  '../node_modules/mocha/mocha.css';
import Mixin from '../src/helpers/Mixin';
import GameMatrix from '../src/components/Games/MemoryMatrix/app';
import GameMemory from '../src/components/Games/MemoryGame/app';


describe ('Field test', function() {
  const app = {
    soundPlayer: null,
    config: null
  }
  const matrix = new GameMatrix(app);
  const memory = new GameMemory(app);
  const test = ['hello','bye','good','magazine','always','game','army','solid','framework'];
  const obj = {
    a: 1,
    b: 2,
  }
    it('Return value is string', function() {
      test.forEach(item => {
        assert.isString(Mixin.uppercaseFirstLetter(item));
      })
    })

    it('Capitalize first char', () => {
      test.forEach(item => {
        assert.equal(item[0].toUpperCase(), Mixin.uppercaseFirstLetter(item)[0]);
      })
    })

    it('Return frozen object', function() {
        assert.isFrozen(Mixin.deepFreeze(obj));
    })

    it('Object deep cloned', () => {
      assert.deepEqual(obj, Mixin.deepClone(obj));
    })

    it('Should correct node element', () => {
      assert.strictEqual(Mixin.getNode('<span></span>').tagName, 'SPAN');
      assert.strictEqual(Mixin.getNode('<div></div>').tagName, 'DIV');
      assert.strictEqual(Mixin.getNode('<article></article>').tagName, 'ARTICLE');
    });

    it('Each game should consist destroyGameInstance() method', () => {
      assert.property(matrix, 'destroyGameInstance');
      assert.property(memory, 'destroyGameInstance');
    })

    it('memoryMatrix.createElementFactory() returns correct element', () => {
      const el = matrix.createElementFactory('div', 'main-id', 'container');
      assert.strictEqual(el.tagName, 'DIV');
      assert.strictEqual(el.classList[0], 'container');
      assert.strictEqual(el.getAttribute('id'), 'main-id');
    })
});
