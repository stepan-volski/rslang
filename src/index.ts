import About from './pages/about';
import Games from './pages/games';
import Main from './pages/main';
import Statistics from './pages/statistics';
import TextBook from './pages/textBook';
import Router from './router/router';
import './index.scss';
import Authorisation from './pages/authorisation';

const router = new Router({
  main: new Main(),
  about: new About(),
  textBook: new TextBook(),
  statistics: new Statistics(),
  games: new Games(),
  authorisation: new Authorisation(),
});

router.init();
