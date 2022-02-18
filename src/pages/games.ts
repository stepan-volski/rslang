/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */    // TODO REMOVE!!!
/* eslint-disable class-methods-use-this */   // TODO REMOVE!!!
import { addPageTitle } from '../utils/addPageTitle';
import { launchGameFromGames } from '../utils/challengeUtils';
import Page from './abstract/page';

class Games extends Page {
  selectedGame: string;
  isHandlersInited: boolean;

  constructor() {
    super('Games');
    this.selectedGame = '';
    this.isHandlersInited = false;
  }

  openPage(): void {
    this.renderPageElements();
    addPageTitle(this.name);
    if (!this.isHandlersInited) {
      this.initHandlers();
    }
  }

  renderPageElements(): void {
    const appContainer = document.getElementById('app') as HTMLElement;
    const pageHtml = `

      <div class="gamesPageContainer">
        <div class="gameCard">
          <img src="../assets/game_sprint.png"></img>
          <div><b>Sprint</b></div>
          <div class="gameDescription">
            You have one minute to guess as many words as you can!
          </div>
          <div data-gameType="sprint" class="gameBackBtn">Play</div>
        </div>

        <div class="gameCard">
          <img src="../assets/game_challenge.png"></img>
          <div><b>Audio Challenge</b></div>
          <div class="gameDescription">
            Listen to words and choose their translation!
          </div>
          <div data-gameType="challenge" class="gameBackBtn">Play</div>
        </div>

      </div>

  `;
    (appContainer as HTMLElement).innerHTML = pageHtml;
  }

  initHandlers(): void {
    document.addEventListener('click', this.startGame.bind(this));
    document.addEventListener('click', this.launchGame.bind(this));
    this.isHandlersInited = true;
  }

  async startGame(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const group = element.dataset.group;

    if (group) {
      launchGameFromGames(Number(group), this.selectedGame);
    }
  }

  launchGame(event: Event): void {
    const element = event.target as HTMLElement;
    const gameName = element.dataset.gametype;
    if (gameName) {
      this.selectedGame = gameName;

      const appContainer = document.getElementById('app') as HTMLElement;
      const pageHtml = `
        <div class="levelSelectorContainer">
          <h2>Select the level:</h2>
          <div class="levelSelector">
            <div class="groupCircle" data-group="0">1</div>
            <div class="groupCircle" data-group="1">2</div>
            <div class="groupCircle" data-group="2">3</div>
            <div class="groupCircle" data-group="3">4</div>
            <div class="groupCircle" data-group="4">5</div>
            <div class="groupCircle" data-group="5">6</div>
          </div>
        </div>

    `;
      (appContainer as HTMLElement).innerHTML = pageHtml;
    }
  }
}

export default Games;
