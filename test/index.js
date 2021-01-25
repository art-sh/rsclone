import '../node_modules/mocha/mocha.css';
import Mixin from '../src/helpers/Mixin';
import GameMatrix from '../src/components/Games/MemoryMatrix/app';
import GameMemory from '../src/components/Games/MemoryGame/app';
import Router from '../src/components/Router';
import SoundPlayer from '../src/components/SoundPlayer';

const {assert} = require('chai');

describe('Brain wars tests', () => {
  const app = {
    soundPlayer: null,
    config: null,
  };
  const matrix = new GameMatrix(app);
  const memory = new GameMemory(app);
  const router = new Router(app);
  const soundPlayer = new SoundPlayer(app);
  const test = ['hello', 'bye', 'good', 'magazine', 'always', 'game', 'army', 'solid', 'framework'];
  const obj = {
    a: 1,
    b: 2,
  };
  it('uppercaseFirstLetter() method return value is string', () => {
    test.forEach((item) => {
      assert.isString(Mixin.uppercaseFirstLetter(item));
    });
  });

  it('uppercaseFirstLetter() method should capitalize first char', () => {
    test.forEach((item) => {
      assert.equal(item[0].toUpperCase(), Mixin.uppercaseFirstLetter(item)[0]);
    });
  });

  it('deepFreeze() method should return frozen object', () => {
    assert.isFrozen(Mixin.deepFreeze(obj));
  });

  it('Mixin.deepClone() should  return deep cloned object', () => {
    assert.deepEqual(obj, Mixin.deepClone(obj));
  });

  it('Mixin.getNode() should return correct node element', () => {
    assert.strictEqual(Mixin.getNode('<span></span>').tagName, 'SPAN');
    assert.strictEqual(Mixin.getNode('<div></div>').tagName, 'DIV');
    assert.strictEqual(Mixin.getNode('<article></article>').tagName, 'ARTICLE');
  });

  it('Each game should consist destroyGameInstance() method', () => {
    assert.property(matrix, 'destroyGameInstance');
    assert.property(memory, 'destroyGameInstance');
  });

  it('memoryMatrix.createElementFactory() returns correct element', () => {
    const el = matrix.createElementFactory('div', 'main-id', 'container');
    assert.strictEqual(el.tagName, 'DIV');
    assert.strictEqual(el.classList[0], 'container');
    assert.strictEqual(el.getAttribute('id'), 'main-id');
  });

  it('difficultyLevelHandler method should work correct', () => {
    matrix.correctAnswers = 17;
    matrix.difficultyLevelHandler();
    assert.strictEqual(matrix.fieldSize, 24);
    matrix.correctAnswers = 1;
    matrix.difficultyLevelHandler();
    assert.strictEqual(matrix.fieldSize, 4);
  });

  it('fieldSize property should should be equal to 4', () => {
    assert.strictEqual(matrix.fieldSize, 4);
  });

  it('buildGameCard() method should return "div"', () => {
    assert.strictEqual(memory.buildGameCard('princess').tagName, 'DIV');
  });

  it('buildGameCard() method should add correct class', () => {
    assert.strictEqual(memory.buildGameCard('princess').classList[0], 'card');
  });

  it('Memory game firstGuess and secondGuess properties should be empty string', () => {
    assert.strictEqual(memory.firstGuess, '');
    assert.strictEqual(memory.secondGuess, '');
  });

  it('getGameNode() method should return correct element', () => {
    assert.strictEqual(memory.getGameNode().tagName, 'DIV');
  });

  it('getGameNode() method should add correct id', () => {
    assert.strictEqual(memory.getGameNode().getAttribute('id'), 'memory-game');
  });

  it('setTimeToNull() method should set time to 00:00', () => {
    memory.elements = {
      stats: {
        time: document.createElement('span'),
      },
    };
    memory.elements.stats.time.textContent = '12:23';
    memory.setTimeToNull();
    assert.strictEqual(memory.elements.stats.time.textContent, '00:00');
  });

  it('getAllSelected() method should return an array', () => {
    memory.elements = {
      game: {
        box: document.createElement('div'),
      },
    };
    for (let i = 0; i < 2; i++) {
      const el = document.createElement('div');
      el.classList.add('.selected');
      memory.elements.game.box.appendChild(el);
    }
    assert.isArray(memory.getAllSelected());
  });

  it('navigate() method should set location hash as string', () => {
    const newRoute = 'game';
    router.navigate(newRoute);
    assert.isString(window.location.hash);
  });

  it('navigate() method should set add "#/" to location hash ', () => {
    const newRoute = 'game';
    router.navigate(newRoute);
    assert.strictEqual(window.location.hash, '#/game');
  });

  it('playSound() method should throw an error if no audio', () => {
    assert.throws(soundPlayer.playSound);
  });

  it('removeSound() should remove sound from buffer', () => {
    soundPlayer.soundBuffers = {
      win: 'testSound',
      lose: 'testLose',
    };
    soundPlayer.removeSound('win');
    assert.doesNotHaveAnyKeys(soundPlayer.soundBuffers, 'win');
  });
});
