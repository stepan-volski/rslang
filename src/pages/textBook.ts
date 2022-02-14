/* eslint-disable no-return-assign */
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
  isPageCompleted: boolean;

  constructor() {
    super('Textbook');
    this.currentPage = 0;
    this.currentGroup = 0;
    this.isDifficultSectionOpened = false;
    this.isPageCompleted = false;
  }

  openPage(): void {
    this.renderPageElements();
    this.renderPageContent();
    this.initHandlers();
  }

  renderPageElements(): void {
    const isHidden = (isUserLoggedIn()) ? '' : 'hidden';
    const pageHtml = `
    <div class="textbookContainer">

      <div class="gamesContainer">
        <div class="gameBtn" data-game="sprint">
          <img class="gameLogo" src="../assets/game_sprint.png"></img>
          <div>Sprint</div>
        </div>
        <div class="gameBtn" data-game="challenge">
          <img class="gameLogo" src="../assets/game_challenge.png"></img>
          <div>Audio Challenge</div>
        </div>
      </div>

      <div class="pageSelector">
        <div data-pageNav="prev"><</div>
        <div id="currentPage">${this.currentPage + 1}</div>
        <div data-pageNav="next">></div>
      </div>

      <div class="contentContainer">
        <div id="content"></div>

        <div class="groupSelector">
          <div class="groupCircle" data-group="0">1</div>
          <div class="groupCircle" data-group="1">2</div>
          <div class="groupCircle" data-group="2">3</div>
          <div class="groupCircle" data-group="3">4</div>
          <div class="groupCircle" data-group="4">5</div>
          <div class="groupCircle" data-group="5">6</div>
        </div>
      </div>

    </div>
  `;
    (this.appContainer as HTMLElement).innerHTML = pageHtml;
  }

  // <div id="controls">
  // <button id="difficultWords" ${isHidden}>Open difficult words section</button>
  // </div>

  async renderPageContent(): Promise<void> {
    if (this.isDifficultSectionOpened) {
      new BookPage(0, 0).render(true);
    } else {
      await new BookPage(this.currentGroup, this.currentPage).render();
      this.checkIfPageIsCompleted();
      this.updatePageCounters();
    }
  }

  initHandlers(): void {
    document.addEventListener('click', this.scrollPage.bind(this));
    document.addEventListener('click', this.openSelectedGroup.bind(this));
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

  openSelectedGroup(event: Event): void {
    const element = event.target as HTMLElement;
    const groupId = element.dataset.group;

    if (groupId) {
      this.currentGroup = Number(groupId);
      this.currentPage = 0;
      this.renderPageContent();
    }
  }

  updatePageCounters(): void {
    (document.getElementById('currentPage') as HTMLDivElement).innerText = `${this.currentPage + 1}`;
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
      (document.getElementById('controls') as HTMLElement).hidden = false;    // TODO - change locator
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

  checkIfPageIsCompleted(): void {
    const wordCards = Array.from(document.getElementsByClassName('wordCard'));
    const cards = wordCards.filter((card) => (card.classList.contains('difficult') || card.classList.contains('learnt')));
    if (cards.length === 20 && !this.isDifficultSectionOpened) {
      document.getElementById('content')?.classList.add('completed');
      const buttons = Array.from(document.querySelectorAll('button[data-game]')) as HTMLButtonElement[];
      buttons.forEach((button) => button.disabled = true);
    } else {
      document.getElementById('content')?.classList.remove('completed');
      const buttons = Array.from(document.querySelectorAll('button[data-game]')) as HTMLButtonElement[];
      buttons.forEach((button) => button.disabled = false);
    }
  }
}

export default TextBook;
