import BookPage from '../components/bookPage';
import {
  markWordAsDifficult, markWordAsLearned, unmarkWordAsDifficult, unmarkWordAsLearned,
} from '../service/usersWordsApi';
import { launchGameFromBook } from '../utils/challengeUtils';
import { isUserLoggedIn } from '../utils/loginUtils';
import Page from './abstract/page';

class TextBook extends Page {
  currentPage: number;
  currentGroup: number;
  isDifficultSectionOpened: boolean;

  constructor() {
    super('Textbook');
    this.currentPage = 0;
    this.currentGroup = 0;
    this.isDifficultSectionOpened = false;
  }

  openPage(): void {
    this.renderPageElements();
    this.renderPageContent();
    this.initHandlers();
  }

  renderPageElements(): void {
    const isHidden = (isUserLoggedIn) ? '' : 'hidden';
    const pageHtml = `
    <div id="textbookContainer">
      <div id="controls">
      <button data-game="sprint" ${isHidden}>Launch Sprint Game</button>
      <button data-game="challenge" ${isHidden}>Launch Audio Challenge Game</button>
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
      <button id="difficultWords" ${isHidden}>Open difficult words section</button>
      <div id="content"></div>
    </div>
  `;
    (this.appContainer as HTMLElement).innerHTML = pageHtml;
  }

  renderPageContent(): void {
    if (this.isDifficultSectionOpened) {
      new BookPage(0, 0).render(true);
    } else {
      new BookPage(this.currentGroup, this.currentPage).render();
      this.updatePageCounters();
    }
  }

  initHandlers(): void {
    document.addEventListener('click', this.scrollPage.bind(this));
    document.getElementById('groupSelect')?.addEventListener('change', this.openSelectedGroup.bind(this));
    document.addEventListener('click', this.markUnmarkWordAsDifficult.bind(this));
    document.addEventListener('click', this.markUnmarkWordAsLearnt.bind(this));
    document.getElementById('difficultWords')?.addEventListener('click', this.toggleDifficultWordsSection.bind(this));
    document.addEventListener('click', this.launchGame.bind(this));
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

  async markUnmarkWordAsDifficult(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const wordId = element.parentElement?.dataset.wordid;

    if (element.className === 'difficultBtn' && wordId) {
      if (element.parentElement.classList.contains('difficult')) {
        await unmarkWordAsDifficult(wordId);
      } else {
        await markWordAsDifficult(wordId);
      }
      this.renderPageContent();
    }
  }

  async markUnmarkWordAsLearnt(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const wordId = element.parentElement?.dataset.wordid;

    if (element.className === 'learntBtn' && wordId) {
      if (element.parentElement.classList.contains('learnt')) {
        await unmarkWordAsLearned(wordId);
      } else {
        await markWordAsLearned(wordId);
      }
      this.renderPageContent();
    }
  }

  toggleDifficultWordsSection(): void {
    if (this.isDifficultSectionOpened) {
      this.isDifficultSectionOpened = false;
      (document.getElementById('controls') as HTMLElement).hidden = false;
      (document.getElementById('difficultWords') as HTMLElement).innerText = 'Open Difficult Words section';
      this.renderPageContent();
    } else {
      this.isDifficultSectionOpened = true;
      (document.getElementById('controls') as HTMLElement).hidden = true;
      (document.getElementById('difficultWords') as HTMLElement).innerText = 'Close Difficult Words section';
      new BookPage(0, 0).render(true);
    }
  }

  async launchGame(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const gameType = element.dataset.game;
    if (gameType === 'sprint') {
      launchGameFromBook(this.currentGroup, this.currentPage, gameType);
    }
    if (gameType === 'challenge') {
      launchGameFromBook(this.currentGroup, this.currentPage, gameType);
    }
  }
}

export default TextBook;
