import About from '../pages/about';
import Authorisation from '../pages/authorisation';
import Games from '../pages/games';
import Main from '../pages/main';
import Statistics from '../pages/statistics';
import TextBook from '../pages/textBook';
import { savingStatOnChangingDay } from '../service/statisticApi';
import { loadUser } from '../utils/loginUtils';

type Routes = {
  main: Main;
  about: About;
  textBook: TextBook;
  statistics: Statistics;
  games: Games;
};

type Pages = 'main' | 'textBook' | 'statistics' | 'about';

class Router {
  routes: Routes;

  currentPage: Pages;
  authorization: Authorisation;
  constructor(routes: { main: Main; about: About; textBook: TextBook; statistics: Statistics;
    games: Games; }) {
    this.routes = routes;
    this.currentPage = 'main';
    this.routes.main.openPage();
    this.authorization = new Authorisation();
  }

  init(): void {
    document.addEventListener('click', this.openPage.bind(this));
    loadUser();
    setInterval(() => {
      savingStatOnChangingDay();
    }, 60000);
  }

  openPage(event: Event): void {
    const element = event.target as HTMLElement;
    const selectedPage = element.dataset.page as Pages;

    if (selectedPage && selectedPage !== this.currentPage) {
      window.history.pushState('', '', `/${selectedPage}`);
      this.routes[selectedPage].openPage();
      this.currentPage = selectedPage;
    }
  }
}

export default Router;
