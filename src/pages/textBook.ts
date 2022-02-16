/* eslint-disable no-return-assign */
import BookPage from '../components/bookPage';
import { baseUrl } from '../service/api';
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
          <img class="gameLogo" src="../assets/game_challenge.png" data-game="challenge"></img>
          <div data-game="challenge">Audio Challenge</div>
        </div>
        <img src="../assets/completed.png" class="completedIcon"></img>
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

        <div class="onlyDifficultToggle" ${isHidden}>
          <span class="material-icons" id="difficultWords">psychology</span>
        </div>
      </div>

    </div>
  `;
    (this.appContainer as HTMLElement).innerHTML = pageHtml;
  }

  async renderPageContent(): Promise<void> {
    if (this.isDifficultSectionOpened) {
      new BookPage(0, 0).render(true);
    } else {
      await new BookPage(this.currentGroup, this.currentPage).render();
      this.checkIfPageIsCompleted();
      this.updatePageCounters();
      this.setPageBackground();
    }
  }

  initHandlers(): void {
    document.addEventListener('click', this.scrollPage.bind(this));
    document.addEventListener('click', this.openSelectedGroup.bind(this));
    document.addEventListener('click', this.markUnmarkWordAsDifficult.bind(this));
    document.addEventListener('click', this.markUnmarkWordAsLearnt.bind(this));
    document.getElementById('difficultWords')?.addEventListener('click', this.toggleDifficultWordsSection.bind(this));
    document.addEventListener('click', this.launchGame.bind(this));
    document.addEventListener('click', TextBook.playCardSound);
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
    const wordCard = element.parentElement?.parentElement?.parentElement;
    const wordId = wordCard?.dataset.wordid;

    if (element.className.includes('difficultIcon') && wordId) {
      if (wordCard.classList.contains('difficult')) {
        await unmarkWordAsDifficult(wordId);
      } else {
        await markWordAsDifficult(wordId);
      }
      this.renderPageContent();
    }
  }

  async markUnmarkWordAsLearnt(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const wordCard = element.parentElement?.parentElement?.parentElement;
    const wordId = wordCard?.dataset.wordid;

    if (element.className.includes('learntIcon') && wordId) {
      if (wordCard.classList.contains('learnt')) {
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
      (document.querySelector('.groupSelector') as HTMLElement).classList.remove('disabled');
      (document.querySelector('.pageSelector') as HTMLElement).classList.remove('disabled');
      (document.querySelector('.gamesContainer') as HTMLElement).classList.remove('disabled');
      (document.getElementById('difficultWords') as HTMLElement).style.color = 'black';
      this.renderPageContent();
    } else {
      this.isDifficultSectionOpened = true;
      (document.querySelector('.groupSelector') as HTMLElement).classList.add('disabled');
      (document.querySelector('.pageSelector') as HTMLElement).classList.add('disabled');
      (document.querySelector('.gamesContainer') as HTMLElement).classList.add('disabled');
      (document.getElementById('difficultWords') as HTMLElement).style.color = 'red';
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
      document.querySelectorAll('.gameBtn').forEach((btn) => btn.classList.add('disabled'));
      (document.querySelector('.completedIcon') as HTMLElement).style.display = 'block';
    } else {
      document.querySelectorAll('.gameBtn').forEach((btn) => btn.classList.remove('disabled'));
      (document.querySelector('.completedIcon') as HTMLElement).style.display = 'none';
    }
  }

  static playCardSound(event: Event): void {
    const element = event.target as HTMLElement;
    const audio = element.dataset.sound;

    if (audio) {
      new Audio(`${baseUrl}/${audio}`).play();
    }
  }

  setPageBackground(): void {
    const container = document.querySelector('.textbookContainer') as HTMLElement;
    switch (this.currentGroup) {
      case 0: container.style.backgroundColor = '#77afaf'; break;
      case 1: container.style.backgroundColor = '#301be9'; break;
      case 2: container.style.backgroundColor = '#f5aa48'; break;
      case 3: container.style.backgroundColor = '#5d54a8'; break;
      case 4: container.style.backgroundColor = '#61e08b'; break;
      case 5: container.style.backgroundColor = '#a3ac54'; break;
      default: break;
    }
  }
}

export default TextBook;
