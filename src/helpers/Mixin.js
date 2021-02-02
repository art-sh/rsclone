const path = require('path');

const Mixin = {
  uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  },
  jsonDecode(string) {
    try {
      return JSON.parse(string);
    } catch (e) {
      return null;
    }
  },
  jsonEncode(obj) {
    return JSON.stringify(obj);
  },
  deepClearObject(object) {
    Object.entries(object).forEach(([key, item]) => {
      if (typeof item === 'object' && item) return Mixin.deepClearObject(item);

      object[key] = null;
    });
  },
  deepFreeze(object) {
    Object.freeze(object);

    Object.getOwnPropertyNames(object).forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(object, prop)
        && object[prop] !== null
        && (typeof object[prop] === 'object' || typeof object[prop] === 'function')
        && !Object.isFrozen(object[prop])
      ) {
        Mixin.deepFreeze(object[prop]);
      }
    });

    return object;
  },
  deepClone(obj) {
    const out = {};

    Object.keys(obj).forEach((key) => {
      const item = obj[key];

      if (typeof item === 'object') {
        if (Array.isArray(item)) {
          out[key] = Array.from(item);
        } else {
          out[key] = Mixin.deepClone(item);
        }
      } else {
        out[key] = item;
      }
    });

    return out;
  },
  listen(event, handler, once = false) {
    document.addEventListener(event, handler, {
      once,
    });
  },
  dispatch(event, data = null) {
    const props = {};

    if (data) props.detail = data;

    document.dispatchEvent(new CustomEvent(event, props));
  },
  parseHTML(template) {
    const node = document.createElement('template');
    node.innerHTML = template;

    return node.content.cloneNode(true);
  },
  /**
   * @param template
   * @return {HTMLElement}
   */
  getNode(template) {
    const newContentElement = document.createElement('div');
    newContentElement.append(Mixin.parseHTML(template));

    return newContentElement.firstChild;
  },
  handleWebpackImport(requireFunction) {
    const out = {};

    requireFunction.keys().forEach((imagePath) => {
      const module = requireFunction(imagePath);

      out[path.basename(imagePath).split('.').shift()] = module.default;
    });

    return out;
  },
  addZero(num) {
    return num.toString().padStart(2, '0');
  },
};

export default Mixin;
