const Mixin = {
  uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
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
  listen(event, handler) {
    document.addEventListener(event, handler);
  },
  dispatch(event, data = null) {
    const props = {};

    if (data) props.detail = data;

    document.dispatchEvent(new CustomEvent(event, props));
  },
  parseHTML(template) {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = template.trim();

    return templateElement.content.cloneNode(true);
  },
};

export default Mixin;
