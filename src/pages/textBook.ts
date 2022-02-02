import BookPage from '../components/bookPage';
import Page from './abstract/page';

class TextBook extends Page {
  constructor() {
    super('Textbook');
  }

  render(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = `<div id="${pageName.toLowerCase()}Container"></div>`;
    new BookPage(1, 2).render();
  }
}

export default TextBook;
