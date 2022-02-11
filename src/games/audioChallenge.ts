/* eslint-disable no-underscore-dangle */
import { Word } from '../service/interfaces';
import { increaseAnswersCount, increaseСountNewWords } from '../service/statisticApi';
import { generateQuestions } from '../utils/challengeUtils';
import ChallengeQuestion from './abstract/challengeQuestion';
import Game from './abstract/game';
import {
  increaseWordLearnProgress, incrementCorrectAnswerCounter, incrementIncorrectAnswerCounter,
  isWordNew, resetWordLearnProgress, unmarkWordAsLearned,
} from '../service/usersWordsApi';

class AudioChallenge extends Game {
  currentQuestionNumber: number;
  currentQuestion: ChallengeQuestion;
  correctAnswers: number;
  incorrectAnswers: number;
  longestWinningStreak: number;
  questions: ChallengeQuestion[];

  constructor(gameData: Word[]) {
    super('Audio Challenge');
    this.currentQuestionNumber = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.longestWinningStreak = 0;
    this.questions = generateQuestions(gameData);
    this.currentQuestion = this.questions[this.currentQuestionNumber];
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
    this.currentQuestion = this.questions[this.currentQuestionNumber];
    this.playCurrentQuestionAudio();
    const buttonContainer = document.getElementById('answerButtons');
    const buttons = Array.from((buttonContainer as HTMLElement).children) as HTMLElement[];

    for (let i = 0; i < 4; i++) {
      buttons[i].innerText = this.currentQuestion.answers[i];
    }

    // todo - move out
    const counter = document.getElementById('questionNumber') as HTMLElement;
    counter.innerText = `Current question is ${this.currentQuestionNumber}/20`;
  }

  answer(event: Event): void {
    const button = event.target as HTMLElement;
    if (button.innerText === this.currentQuestion.questionWord?.wordTranslate) {
      this.registerCorrectAnswer();
    } else {
      this.registerIncorrectAnswer();
    }
    this.currentQuestionNumber++;
    this.showQuestion();

    if (this.currentQuestionNumber >= 19) {
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
    // todo - move out
    const counter = document.getElementById('correctCounter') as HTMLElement;
    counter.innerText = `Correct Answers: ${this.correctAnswers}`;

    const word = this.currentQuestion.questionWord as Word;
    const wordId = word._id as string;
    this.correctAnswers++;
    this.longestWinningStreak++;

    // send statistics
    increaseAnswersCount('Audio Challenge', 'correct');
    incrementCorrectAnswerCounter(wordId);
    if (isWordNew(word)) {
      increaseСountNewWords('Audio Challenge');
    }
    if (!word.userWord?.optional.learned) {
      increaseWordLearnProgress(wordId);
    }
  }

  registerIncorrectAnswer(): void {
    // todo - move out
    const counter = document.getElementById('incorrectCounter') as HTMLElement;
    counter.innerText = `Incorrect Answers: ${this.incorrectAnswers}`;

    const word = this.currentQuestion.questionWord as Word;
    const wordId = word._id as string;
    this.incorrectAnswers++;
    this.longestWinningStreak = 0;

    // send statistics
    increaseAnswersCount('Audio Challenge', 'incorrect');
    incrementIncorrectAnswerCounter(wordId);
    resetWordLearnProgress(wordId);

    if (isWordNew(word)) {
      increaseСountNewWords('Audio Challenge');
    }
    if (word.userWord?.optional.learned) {
      unmarkWordAsLearned(wordId);
    }
  }

  playCurrentQuestionAudio(): void {
    const baseUrl = 'https://rs-lang-application.herokuapp.com/';
    const src = this.currentQuestion.questionWord?.audio;
    new Audio(baseUrl + src).play();
  }
}

export default AudioChallenge;

// check if current question is reset correctly
