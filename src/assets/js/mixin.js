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
};

export default Mixin;
