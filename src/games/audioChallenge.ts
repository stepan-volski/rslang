/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import { Word } from '../service/interfaces';
import {
  getStatistic, increaseAnswersCount, increaseСountNewWords, setWinningStreak,
} from '../service/statisticApi';
import { generateQuestions } from '../utils/challengeUtils';
import ChallengeQuestion from './abstract/challengeQuestion';
import Game from './abstract/game';
import {
  increaseWordLearnProgress, incrementCorrectAnswerCounter, incrementIncorrectAnswerCounter,
  isWordNew, resetWordLearnProgress, unmarkWordAsLearned,
} from '../service/usersWordsApi';
import { isUserLoggedIn } from '../utils/loginUtils';
import { router } from '..';

class AudioChallenge extends Game {
  currentQuestionNumber: number;
  currentQuestion: ChallengeQuestion;
  correctAnswers: number;
  incorrectAnswers: number;
  longestWinningStreak: number;
  questions: ChallengeQuestion[];
  isUserLoggedIn: boolean;
  correctAnsweredWords: Word[];
  incorrectAnsweredWords: Word[];

  constructor(gameData: Word[]) {
    super('Audio Challenge');
    this.currentQuestionNumber = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.longestWinningStreak = 0;
    this.questions = generateQuestions(gameData);
    this.currentQuestion = this.questions[this.currentQuestionNumber];
    this.isUserLoggedIn = isUserLoggedIn();
    this.correctAnsweredWords = [];
    this.incorrectAnsweredWords = [];
  }

  public startGame(): void {
    this.render();
    this.initHandlers();
    this.showQuestion();
  }

  private render(): void {
    const appContainer = document.getElementById('app');
    const gameHtml = `
      <div id="gameContainer" class="gameContainer">
        <span class="material-icons" id="closeIcon">close</span>
        <div id="questionNumber">1</div>
        <div class="score">
          <span id="correctCounter">${this.correctAnswers}</span>
          <span>/</span>
          <span id="incorrectCounter">${this.incorrectAnswers}</span>
        </div>

        <img id="audioQuestion" src="../assets/audio_q.png" class="audioQuestion"></img>
        <div class="answerButtons">
          <div class="answerBtn" data-key="KeyA"></div>
          <div class="answerBtn" data-key="KeyS"></div>
          <div class="answerBtn" data-key="KeyD"></div>
          <div class="answerBtn" data-key="KeyF"></div>
        </div>

        <div class="keysContainer">
          <div class="keyBtn">A</div>
          <div class="keyBtn">S</div>
          <div class="keyBtn">D</div>
          <div class="keyBtn">F</div>
        </div>
      </div>
  `;
    (appContainer as HTMLElement).innerHTML = gameHtml;
  }

  private showQuestion(): void {
    this.currentQuestion = this.questions[this.currentQuestionNumber];
    this.playCurrentQuestionAudio();
    const buttons = Array.from(document.getElementsByClassName('answerBtn')) as HTMLElement[];

    for (let i = 0; i < 4; i++) {
      buttons[i].innerText = this.currentQuestion.answers[i] || '';
    }

    const counter = document.getElementById('questionNumber') as HTMLElement;
    counter.innerText = `${this.currentQuestionNumber + 1}/${this.questions.length}`;
  }

  private answerByClick(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.className === 'answerBtn') {
      const answer = element.innerText;
      this.answer(answer);
    }
  }

  private answerByKey(event: KeyboardEvent): void {
    const key = event.code;
    const gameIndicator = document.getElementById('audioQuestion');
    if (gameIndicator) {
      if (key === 'KeyA' || key === 'KeyS' || key === 'KeyD' || key === 'KeyF') {
        const button = document.querySelector(`[data-key='${key}']`) as HTMLElement;
        const answer = button.innerText;
        this.answer(answer);
      }
    }
  }

  private async answer(answer: string): Promise<void> {
    const questionsAmount = this.questions.length;
    if (answer === this.currentQuestion.questionWord?.wordTranslate) {
      await this.registerCorrectAnswer();
    } else {
      await this.registerIncorrectAnswer();
    }
    this.currentQuestionNumber++;

    if (this.currentQuestionNumber >= questionsAmount) {
      this.showResults();
    } else {
      this.showQuestion();
    }
  }

  private initHandlers(): void {
    Array.from(document.getElementsByClassName('answerBtn'))
      .forEach((btn) => btn.addEventListener('click', this.answerByClick.bind(this)));
    document.getElementById('audioQuestion')?.addEventListener('click', this.playCurrentQuestionAudio.bind(this));
    document.getElementById('closeIcon')?.addEventListener('click', AudioChallenge.closeGame);
    document.addEventListener('keydown', this.answerByKey.bind(this));
  }

  private showResults(): void {
    new Audio('../assets/sound/end-of-round.mp3').play();
    const appContainer = document.getElementById('app');
    const resultsHtml = `
    <div id="resultsContainer" class="gameContainer">
      <h3>Your score is ${this.correctAnswers}/${this.questions.length}</h3>
      <div class="resultsTable">
        <div class="resultsRow">
          <div>
            <span class="material-icons" style="color:green;">check</span>
            <span><b>Correct Answers:</b></span>
          </div>
          <div>${this.correctAnsweredWords.map((word) => AudioChallenge.generateResults(word)).join('')}</div>
        </div>

        <div>
          <div>
            <span class="material-icons" style="color:red;">error</span>
            <span><b>Inorrect Answers:</b></span>
          </div>
          <div>${this.incorrectAnsweredWords.map((word) => AudioChallenge.generateResults(word)).join('')}</div>
        </div>

      </div>
      <div class="gameBackBtn" id="backBtn">Back</div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = resultsHtml;
    document.getElementById('backBtn')?.addEventListener('click', AudioChallenge.closeGame);
    this.updateWinningStreak();
  }

  private async registerCorrectAnswer(): Promise<void> {
    new Audio('../assets/sound/correct.mp3').play();
    this.correctAnswers++;
    const counter = document.getElementById('correctCounter') as HTMLElement;
    counter.innerText = `${this.correctAnswers}`;

    const word = this.currentQuestion.questionWord as Word;
    this.correctAnsweredWords.push(word);
    const wordId = (word._id || word.id) as string;

    if (this.isUserLoggedIn) {
      this.longestWinningStreak++;
      await increaseAnswersCount(this.name, 'correct');
      await incrementCorrectAnswerCounter(wordId);
      if (isWordNew(word)) {
        await increaseСountNewWords(this.name);
      }
      if (!word.userWord?.optional.learned) {
        await increaseWordLearnProgress(wordId);
      }
    }
  }

  private async registerIncorrectAnswer(): Promise<void> {
    new Audio('../assets/sound/wrong.mp3').play();
    this.incorrectAnswers++;
    const counter = document.getElementById('incorrectCounter') as HTMLElement;
    counter.innerText = `${this.incorrectAnswers}`;

    const word = this.currentQuestion.questionWord as Word;
    this.incorrectAnsweredWords.push(word);
    const wordId = (word._id || word.id) as string;

    if (this.isUserLoggedIn) {
      this.longestWinningStreak = 0;
      await increaseAnswersCount(this.name, 'incorrect');
      await incrementIncorrectAnswerCounter(wordId);
      await resetWordLearnProgress(wordId);

      if (isWordNew(word)) {
        await increaseСountNewWords(this.name);
      }
      if (word.userWord?.optional.learned) {
        await unmarkWordAsLearned(wordId);
      }
    }
  }

  private playCurrentQuestionAudio(): void {
    const baseUrl = 'https://rs-lang-application.herokuapp.com/';
    const src = this.currentQuestion.questionWord?.audio;
    new Audio(baseUrl + src).play();
  }

  private async updateWinningStreak(): Promise<void> {
    const stat = await getStatistic();
    const savedStreak = stat.optional.day.audioChallenge.correctAnswersSeriesLength;
    if (this.longestWinningStreak > savedStreak) {
      await setWinningStreak(this.name, this.longestWinningStreak);
    }
  }

  private static generateResults(word: Word): string {
    return `
    <div>
      <span>${word.word}</span>
      <span> - </span>
      <span>${word.wordTranslate}</span>
    </div>`;
  }

  private static closeGame(): void {
    const currentPage = window.location.pathname.substring(1);
    router.openSelectedPage(currentPage);
  }
}

export default AudioChallenge;
