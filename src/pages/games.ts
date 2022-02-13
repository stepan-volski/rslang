/* eslint-disable class-methods-use-this */   // TODO REMOVE!!!
import { launchGameFromGames } from '../utils/challengeUtils';
import Page from './abstract/page';

class Games extends Page {
  constructor() {
    super('Games');
  }

  openPage(): void {
    this.renderPageElements();
    this.initHandlers();
  }

  renderPageElements(): void {
    const appContainer = document.getElementById('app') as HTMLElement;
    const pageHtml = `
    <div id="GamesContainer">
      <button id="audioChallengeBtn" data-game="challenge">Audio Challenge</button>
      <button id="sprintBtn" data-game="sprint">Sprint</button>
      <select id="groupSelect">
      <option value="0">1</option>
      <option value="1">2</option>
      <option value="2">3</option>
      <option value="3">4</option>
      <option value="4">5</option>
      <option value="5">6</option>
    </select>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = pageHtml;
  }

  initHandlers(): void {
    document.addEventListener('click', this.launchGame.bind(this));
  }

  async launchGame(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    const gameName = element.dataset.game;
    const group = Number((document.getElementById('groupSelect') as HTMLSelectElement).value);

    if (gameName === 'challenge') {
      launchGameFromGames(group, 'challenge');
    }

    if (gameName === 'sprint') {
      launchGameFromGames(group, 'sprint');
    }
  }
}

export default Games;
