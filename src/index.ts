import Games from './pages/games';
import Main from './pages/main';
import Statistics from './pages/statistics';
import TextBook from './pages/textBook';
import Router from './router/router';
import './index.scss';
import Team from './pages/team';

const router = new Router({
  main: new Main(),
  team: new Team(),
  textBook: new TextBook(),
  statistics: new Statistics(),
  games: new Games(),
});

router.init();
