import About from '../pages/about';
import Games from '../pages/games';
import Main from '../pages/main';
import Statistics from '../pages/statistics';
import TextBook from '../pages/textBook';

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

  constructor(routes: { main: Main; about: About; textBook: TextBook; statistics: Statistics; games: Games }) {
    this.routes = routes;
    this.currentPage = 'main';
    this.routes.main.render();
  }

  init(): void {
    document.addEventListener('click', this.openPage.bind(this));
  }

  openPage(event: Event): void {
    const element = event.target as HTMLElement;
    const selectedPage = element.dataset.page as Pages;

    if (selectedPage && selectedPage !== this.currentPage) {
      window.history.pushState('', '', `/${selectedPage}`);
      this.routes[selectedPage].render();
      this.currentPage = selectedPage;
    }
  }
}

export default Router;
