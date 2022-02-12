import About from '../pages/about';
import Authorisation from '../pages/authorisation';
import Games from '../pages/games';
import Main from '../pages/main';
import Statistics from '../pages/statistics';
import TextBook from '../pages/textBook';
import { loadUser } from '../utils/loginUtils';

type Routes = {
  main: Main;
  about: About;
  textBook: TextBook;
  statistics: Statistics;
  games: Games;
  authorisation: Authorisation;
};

type Pages = 'main' | 'textBook' | 'statistics' | 'about' | 'authorisation';

class Router {
  routes: Routes;

  currentPage: Pages;

  constructor(routes: { main: Main; about: About; textBook: TextBook; statistics: Statistics;
    games: Games; authorisation: Authorisation }) {
    this.routes = routes;
    this.currentPage = 'main';
    this.routes.main.openPage();
  }

  init(): void {
    document.addEventListener('click', this.openPage.bind(this));
    loadUser();
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
