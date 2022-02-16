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

class AudioChallenge extends Game {
  currentQuestionNumber: number;
  currentQuestion: ChallengeQuestion;
  correctAnswers: number;
  incorrectAnswers: number;
  longestWinningStreak: number;
  questions: ChallengeQuestion[];
  isUserLoggedIn: boolean;

  constructor(gameData: Word[]) {
    super('Audio Challenge');
    this.currentQuestionNumber = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.longestWinningStreak = 0;
    this.questions = generateQuestions(gameData);
    this.currentQuestion = this.questions[this.currentQuestionNumber];
    this.isUserLoggedIn = isUserLoggedIn();
  }

  public startGame(): void {
    this.render();
    this.initHandlers();
    this.showQuestion();
  }

  private render(): void {
    const appContainer = document.getElementById('app');
    const asd = this.name;  // remove
    const gameHtml = `
    <div id="gameContainer" class="gameContainer">
        <div id="questionNumber">1</div>
        <div class="score">
          <span id="correctCounter">0</span>
          <span>/</span>
          <span id="incorrectCounter">0</span>
        </div>

        <img id="audioQuestion" src="../assets/audio_q.png" class="audioQuestion"></img>
        <div class="answerButtons">
          <div class="answerBtn"></div>
          <div class="answerBtn"></div>
          <div class="answerBtn"></div>
          <div class="answerBtn"></div>
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
      buttons[i].innerText = this.currentQuestion.answers[i];
    }

    const counter = document.getElementById('questionNumber') as HTMLElement;
    counter.innerText = `${this.currentQuestionNumber + 1}/${this.questions.length}`;
  }

  private async answer(event: Event): Promise<void> {
    const questionsAmount = this.questions.length;
    const button = event.target as HTMLElement;
    if (button.innerText === this.currentQuestion.questionWord?.wordTranslate) {
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
      .forEach((btn) => btn.addEventListener('click', this.answer.bind(this)));
    document.getElementById('audioQuestion')?.addEventListener('click', this.playCurrentQuestionAudio.bind(this));
  }

  private showResults(): void {
    new Audio('../assets/sound/end-of-round.mp3').play();
    const appContainer = document.getElementById('app');
    const resultsHtml = `
    <div id="resultsContainer">
      <div>Results page for ${this.name} game</div>
      <div>Correct Answers: ${this.correctAnswers}</div>
      <div>Incorrect Answers: ${this.incorrectAnswers}</div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = resultsHtml;
    this.updateWinningStreak();
  }

  private async registerCorrectAnswer(): Promise<void> {
    new Audio('../assets/sound/correct.mp3').play();
    this.correctAnswers++;
    const counter = document.getElementById('correctCounter') as HTMLElement;
    counter.innerText = `${this.correctAnswers}`;

    const word = this.currentQuestion.questionWord as Word;
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
}

export default AudioChallenge;
