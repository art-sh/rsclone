import header from './header';

const modules = [
  {
    moduleKey: 'header',
    module: header,
  },
];
const translations = {};

modules.forEach((config) => {
  Object.entries(config.module).forEach(([key, value]) => {
    translations[`${config.moduleKey}__${key}`] = value;
  });
});

export default translations;
