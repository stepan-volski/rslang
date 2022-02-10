/* eslint-disable class-methods-use-this */   // TODO REMOVE!!!

import AudioChallenge from '../games/audioChallenge';
import Sprint from '../games/sprint';
import { getWords } from '../service/api';
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

    if (gameName === 'challenge') {
      const game = new AudioChallenge();
      const words = await getWords(1, 1);
      game.startGame(words);
    }

    if (gameName === 'sprint') {
      console.log('sprint game is launched');
      const game = new Sprint();
      const words = await getWords(1, 1);
      game.startGame(words);
    }
  }
}

export default Games;
