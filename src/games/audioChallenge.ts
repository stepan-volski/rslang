import { Word } from '../service/interfaces';
import { generateQuestions } from '../utils/challengeUtils';
import ChallengeQuestion from './abstract/challengeQuestion';
import Game from './abstract/game';

class AudioChallenge extends Game {
  currentQuestion: number;
  correctAnswers: number;
  incorrectAnswers: number;
  longestWinningStreak: number;
  questions: ChallengeQuestion[];

  constructor(gameData: Word[]) {
    super('Audio Challenge');
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.longestWinningStreak = 0;
    this.questions = generateQuestions(gameData);
  }

  startGame(): void {
    this.render();
    this.initHandlers();
    this.showQuestion();
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
        <div id="audioQuestion">Click for audio</div>
        <div id="answerButtons">
          <button></button>
          <button></button>
          <button></button>
          <button></button>
        </div>
      </div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = gameHtml;
  }

  showQuestion(): void {
    this.playCurrentQuestionAudio();
    const question = this.questions[this.currentQuestion];
    const buttonContainer = document.getElementById('answerButtons');
    const buttons = Array.from((buttonContainer as HTMLElement).children) as HTMLElement[];

    for (let i = 0; i < 4; i++) {
      buttons[i].innerText = question.answers[i];
    }

    // move out
    const counter = document.getElementById('questionNumber') as HTMLElement;
    counter.innerText = `Current question is ${this.currentQuestion}/20`;
  }

  answer(event: Event): void {
    const button = event.target as HTMLElement;
    if (button.innerText === this.questions[this.currentQuestion].questionWord?.wordTranslate) {
      this.registerCorrectAnswer();
    } else {
      this.registerIncorrectAnswer();
    }
    this.currentQuestion++;
    this.showQuestion();

    if (this.currentQuestion >= 19) {
      this.showResults();
    }
  }

  initHandlers(): void {
    const btnContainer = document.getElementById('answerButtons') as HTMLElement;
    Array.from((btnContainer.children)).forEach((btn) => btn.addEventListener('click', this.answer.bind(this)));
    document.getElementById('audioQuestion')?.addEventListener('click', this.playCurrentQuestionAudio.bind(this));
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

  playCurrentQuestionAudio(): void {
    const baseUrl = 'https://rs-lang-application.herokuapp.com/';
    const src = this.questions[this.currentQuestion].questionWord?.audio;
    new Audio(baseUrl + src).play();
  }
}

export default AudioChallenge;
