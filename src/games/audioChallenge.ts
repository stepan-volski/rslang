/* eslint-disable no-return-assign */
import Game from './abstract/game';

class AudioChallenge extends Game {
  currentQuestion: number;

  constructor() {
    super('AudioChallenge');
    this.currentQuestion = 0;
  }

  static render(): void {
    const appContainer = document.getElementById('app');
    const gameHtml = `
    <div id="gameContainer">
      <div id="game">
        <div id="wordsCounter"></div>
        <div id="audioQuestion"></div>
        <div id="answerButtons">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
        </div>
      </div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = gameHtml;
  }

  generateQuestion(): void {
    (document.getElementById('audioQuestion') as HTMLDivElement).innerText = this.gameData[this.currentQuestion].word;

    const buttons = Array.from((document.getElementById('answerButtons')!.children)) as HTMLElement[];
    buttons.forEach((button) => button.innerText = this.gameData[this.currentQuestion].word);

    document.getElementById('wordsCounter')!.innerText = String(this.currentQuestion);
  }

  answer(): void {
    if (this.currentQuestion % 2 === 0) {
      this.registerCorrectAnswer();
    } else {
      this.registerIncorrectAnswer();
    }
    this.currentQuestion++;
    this.generateQuestion();

    if (this.currentQuestion === 20) {
      this.showResults();
    }
  }

  initHandlers(): void {
    Array.from((document.getElementById('answerButtons')!.children))
    .forEach((btn) => btn.addEventListener('click', this.answer.bind(this)));
  }

  showResults(): void {
    const abc = this.currentQuestion;
    console.log(`results${abc}`);
  }
}

export default AudioChallenge;
