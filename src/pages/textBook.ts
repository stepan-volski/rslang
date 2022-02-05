import BookPage from '../components/bookPage';
import { createWord } from '../service/api';
import Page from './abstract/page';

class TextBook extends Page {
  currentPage: number;
  currentGroup: number;

  constructor() {
    super('Textbook');
    this.currentPage = 0;
    this.currentGroup = 0;
  }

  openPage(): void {
    this.renderPageElements();
    this.renderPageContent();
    this.initHandlers();
  }

  renderPageElements(): void {
    const pageHtml = `
    <div id="textbookContainer">
      <div id="controls">
        <div id="currentPage">Current page: ${this.currentPage}</div>
        <div id="currentGroup">Current group: ${this.currentGroup}</div>
        <button data-pageNav="prev">prev</button>
        <button data-pageNav="next">next</button>
        <div>Select group</div>
        <select id="groupSelect">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div id="content"></div>
    </div>
  `;
    this.appContainer?.insertAdjacentHTML('afterbegin', pageHtml);
  }

  renderPageContent(): void {
    new BookPage(this.currentGroup, this.currentPage).render();
    this.updatePageCounters();
  }

  initHandlers(): void {
    document.addEventListener('click', this.scrollPage.bind(this));
    document.getElementById('groupSelect')?.addEventListener('change', this.openSelectedGroup.bind(this));
    document.addEventListener('click', TextBook.markWordAsDifficult.bind(this));
  }

  scrollPage(event: Event): void {
    const element = event.target as HTMLElement;
    const buttonName = element.dataset.pagenav;

    if (buttonName === 'prev' && this.currentPage > 0) {
      this.currentPage -= 1;
      this.renderPageContent();
    }

    if (buttonName === 'next' && this.currentPage < 29) {
      this.currentPage += 1;
      this.renderPageContent();
    }
  }

  openSelectedGroup(): void {
    this.currentGroup = Number((document.getElementById('groupSelect') as HTMLSelectElement).value);
    this.currentPage = 0;
    this.renderPageContent();
  }

  updatePageCounters(): void {
    (document.getElementById('currentPage') as HTMLDivElement).innerText = `Current page: ${this.currentPage}`;
    (document.getElementById('currentGroup') as HTMLDivElement).innerText = `Current group: ${this.currentGroup}`;
  }

  static async markWordAsDifficult(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const wordId = element.parentElement?.dataset.wordid;

    if (element.className === 'difficultBtn' && wordId) {
      await createWord('testUser', wordId);
      // refresh page and mark words on ui
    }
  }
}

export default TextBook;
