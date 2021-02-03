import header from './header';
import footer from './footer';
import profile from './profile';
import statistic from './statistic';
import welcome from './welcome';
import game from './game';

const modules = [
  {moduleKey: 'header', module: header},
  {moduleKey: 'footer', module: footer},
  {moduleKey: 'profile', module: profile},
  {moduleKey: 'statistic', module: statistic},
  {moduleKey: 'welcome', module: welcome},
  {moduleKey: 'game', module: game},
];
const translations = {};

modules.forEach((config) => {
  Object.entries(config.module).forEach(([key, value]) => {
    translations[`${config.moduleKey}__${key}`] = value;
  });
});

export default translations;
