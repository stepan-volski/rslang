import About from './pages/about';
import Games from './pages/games';
import Main from './pages/main';
import Statistics from './pages/statistics';
import TextBook from './pages/textBook';
import Router from './router/router';
import './style.scss';

const router = new Router({
  main: new Main(),
  about: new About(),
  textBook: new TextBook(),
  statistics: new Statistics(),
  games: new Games(),
});

router.init();
