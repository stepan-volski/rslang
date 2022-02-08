import { Word } from '../service/interfaces';
import Game from './abstract/game';

class AudioChallenge extends Game {
  currentQuestion: number;
  correctAnswers: number;
  incorrectAnswers: number;
  gameData: Word[];

  constructor() {
    super('Audio Challenge');
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.gameData = [];
  }

  startGame(gameData: Word[]): void {
    this.setGameData(gameData);
    this.render();
    this.initHandlers();
    this.generateQuestion();
  }

  render(): void {
    const appContainer = document.getElementById('app');
    const gameHtml = `
    <div id="gameContainer">
      <div id="game">
        <div>Welcome to ${this.name} game!</div>
        <div id="questionNumber">1</div>
        <div id="correctCounter">Correct Answers: 0</div>
        <div id="incorrectCounter">Incorrect Answers: 0</div>
        <div id="audioQuestion"></div>
        <div id="answerButtons">
          <button id="correct"></button>
          <button>wrong answer 1</button>
          <button>wrong answer 2</button>
          <button>wrong answer 3</button>
        </div>
      </div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = gameHtml;
  }

  generateQuestion(): void {
    (document.getElementById('audioQuestion') as HTMLDivElement).innerText = this.gameData[this.currentQuestion].word;
    const button = document.getElementById('correct') as HTMLElement;
    button.innerText = this.gameData[this.currentQuestion].wordTranslate;

    const counter = document.getElementById('questionNumber') as HTMLElement;
    counter.innerText = `Current question is ${this.currentQuestion}`;
  }

  answer(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.id === 'correct') {
      this.registerCorrectAnswer();
    } else {
      this.registerIncorrectAnswer();
    }
    this.currentQuestion++;
    this.generateQuestion();

    if (this.currentQuestion >= 19) {
      this.showResults();
    }
  }

  initHandlers(): void {
    const btnContainer = document.getElementById('answerButtons') as HTMLElement;
    Array.from((btnContainer.children)).forEach((btn) => btn.addEventListener('click', this.answer.bind(this)));
  }

  showResults(): void {
    const appContainer = document.getElementById('app');
    const resultsHtml = `
    <div id="resultsContainer">
      <div>Results page for ${this.name} game</div>
      <div>Correct Answers: ${this.correctAnswers}</div>
      <div>Incorrect Answers: ${this.incorrectAnswers}</div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = resultsHtml;
  }

  registerCorrectAnswer(): void {
    const counter = document.getElementById('correctCounter') as HTMLElement;
    this.correctAnswers++;
    counter.innerText = `Correct Answers: ${this.correctAnswers}`;
    // + send statistics
  }

  registerIncorrectAnswer(): void {
    const counter = document.getElementById('incorrectCounter') as HTMLElement;
    this.incorrectAnswers++;
    counter.innerText = `Incorrect Answers: ${this.incorrectAnswers}`;
    // + send statistics
  }

  setGameData(words: Word[]): void {
    this.gameData = words;
  }
}

export default AudioChallenge;
