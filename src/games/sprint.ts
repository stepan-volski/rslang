/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import { sprintTimer } from '../components/timer';
import Games from '../pages/games';
import { Word } from '../service/interfaces';
import { increaseAnswersCount, increaseСountNewWords, setWinningStreak } from '../service/statisticApi';
import {
  increaseWordLearnProgress,
  incrementCorrectAnswerCounter,
  incrementIncorrectAnswerCounter,
  isWordNew, resetWordLearnProgress,
  unmarkWordAsLearned,
} from '../service/usersWordsApi';
import { generateQuestions } from '../utils/challengeUtils';
import { isUserLoggedIn } from '../utils/loginUtils';
import { getRandom } from '../utils/sprintUtils';
import ChallengeQuestion from './abstract/challengeQuestion';
import Game from './abstract/game';

class Sprint extends Game {
  currentQuestion: number;
  correctAnswers: number;
  incorrectAnswers: number;
  gameData: Word[];
  correctness: boolean;
  totalScore: number;
  correctStreak: number;
  gameTime: number;
  currentWord: Word;
  longestWinningStreak: number;
  temporaryWinningStreak: number;
  isUserLoggedIn: boolean;
  correctAnsweredWords: Word[];
  incorrectAnsweredWords: Word[];
  questions: ChallengeQuestion[];
  constructor(gameData: Word[]) {
    super('Sprint');
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.gameData = [];
    this.correctness = false;
    this.totalScore = 0;
    this.correctStreak = 0;
    this.longestWinningStreak = 0;
    this.temporaryWinningStreak = 0;
    this.gameTime = 60;
    this.currentWord = {
      id: '',
      _id: '',
      group: '',
      page: '',
      word: '',
      image: '',
      audio: '',
      audioMeaning: '',
      audioExample: '',
      textMeaning: '',
      textExample: '',
      transcription: '',
      textExampleTranslate: '',
      textMeaningTranslate: '',
      wordTranslate: '',
    };
    this.isUserLoggedIn = isUserLoggedIn();
    this.correctAnsweredWords = [];
    this.incorrectAnsweredWords = [];
    this.questions = generateQuestions(gameData);
  }

  startGame(gameData: Word[]): void {
    this.setGameData(gameData);
    this.render();
    this.initHandlers();
    this.generateQuestion();
    this.runTimer();
  }

  render(): void {
    const appContainer = document.getElementById('app');
    const gameHtml = `
    <div id="gameContainer" class="gameContainer">
    <span class="material-icons" id="closeIcon">close</span>
      <div id="game-sprint">
        <div id="total-score-container">score:<span id="total-score">${this.totalScore}</span></div>
        <div id="score-increase-light"><span></span><span></span><span></span></div>
        <div id="score-increase"> +10 points per answer</div>
        <div id="questionNumber">0</div>
        <div id="correctCounter">Correct Answers: 0</div>
        <div id="incorrectCounter">Incorrect Answers: 0</div>
        <div id="sprint-timer">0</div>
        <div id="sprint-question-container">
          <div id="sprint-question"></div>
          <div id="sprint-question-translate"></div>
        </div>
        
        <div id="answerButtons">
          <button id="correct-answer-sprint-btn" class="answerBtn">correct</button>
          <button id="incorrect-answer-sprint-btn" class="answerBtn">incorrect</button>
        </div>
        <div id="keydown-sprint">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = gameHtml;
  }

  generateQuestion(): void {
    const question = document.getElementById('sprint-question') as HTMLDivElement;
    const translateQuestion = document.getElementById('sprint-question-translate') as HTMLDivElement;

    question.innerText = this.gameData[this.currentQuestion].word;
    this.currentWord = this.gameData[this.currentQuestion];

    if (getRandom(100) > 50) {
      translateQuestion.innerText = this.gameData[getRandom(100)].wordTranslate;
      this.correctness = false;
    } else {
      translateQuestion.innerText = this.gameData[this.currentQuestion].wordTranslate;
      this.correctness = true;
    }

    const counter = document.getElementById('questionNumber') as HTMLElement;
    counter.innerText = `${this.currentQuestion}`;
  }

  answer(event: Event): void {
    const element = event.target as HTMLElement;
    if ((element.id === 'correct-answer-sprint-btn' && this.correctness === true)
    || (element.id === 'incorrect-answer-sprint-btn' && this.correctness === false)) {
      this.correctAnswer();
    } else {
      this.incorrectAnswer();
    }
  }

  private incorrectAnswer(): void {
    this.temporaryWinningStreak = 0;
    this.correctStreak = 0;
    Sprint.changeLights(this.correctStreak);
    this.updateScore(-1);
    this.registerIncorrectAnswer();
    this.currentQuestion++;
    this.generateQuestion();
  }

  private correctAnswer(): void {
    if (this.correctStreak < 3) this.correctStreak += 1;
    Sprint.changeLights(this.correctStreak);
    this.temporaryWinningStreak += 1;
    if (this.temporaryWinningStreak > this.longestWinningStreak) {
      this.longestWinningStreak += 1;
      setWinningStreak(this.name, this.longestWinningStreak);
    }
    this.registerCorrectAnswer();
    this.updateScore(this.correctStreak);
    this.currentQuestion++;
    this.generateQuestion();
  }

  initHandlers(): void {
    const btnContainer = document.getElementById('answerButtons') as HTMLElement;
    Array.from((btnContainer.children)).forEach((btn) => btn.addEventListener('click', this.answer.bind(this)));
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (
        ((e.code === 'ArrowLeft' || e.code === 'Digit1') && this.correctness === true)
        || ((e.code === 'ArrowRight' || e.code === 'Digit2') && this.correctness === false)) {
        this.correctAnswer();
      } else {
        this.incorrectAnswer();
      }
    });
    document.getElementById('closeIcon')?.addEventListener('click', Sprint.goToGames.bind(this));
  }

  async registerCorrectAnswer(): Promise<void> {
    new Audio('../assets/sound/correct.mp3').play();
    const counter = document.getElementById('correctCounter') as HTMLElement;
    this.correctAnswers++;
    counter.innerText = `Correct Answers: ${this.correctAnswers}`;
    // + send statistics
    await increaseAnswersCount(this.name, 'correct');
    await incrementCorrectAnswerCounter(this.currentWord._id as string);
    if (isWordNew(this.currentWord)) {
      await increaseСountNewWords(this.name);
    }
    if (this.currentWord.userWord?.optional.learned) {
      await increaseWordLearnProgress(this.currentWord._id as string);
    }
    this.correctAnsweredWords.push(this.currentWord);
  }

  async registerIncorrectAnswer(): Promise<void> {
    new Audio('../assets/sound/wrong.mp3').play();
    const counter = document.getElementById('incorrectCounter') as HTMLElement;
    this.incorrectAnswers++;
    counter.innerText = `Incorrect Answers: ${this.incorrectAnswers}`;
    // + send statistics
    await increaseAnswersCount(this.name, 'incorrect');
    await incrementIncorrectAnswerCounter(this.currentWord._id as string);
    await resetWordLearnProgress(this.currentWord._id as string);

    if (isWordNew(this.currentWord)) {
      await increaseСountNewWords(this.name);
    }
    if (this.currentWord.userWord?.optional.learned) {
      await unmarkWordAsLearned(this.currentWord._id as string);
    }
    this.incorrectAnsweredWords.push(this.currentWord);
  }
  private runTimer(): void {
    sprintTimer();
    const timer = setInterval(() => {
      if (!document.getElementById('game-sprint')) clearInterval(timer);
      this.gameTime -= 1;
    }, 1000);
    setTimeout(() => {
      if (document.getElementById('base-timer-label')) {
        clearInterval(timer);
        this.showResults();
      }
    }, this.gameTime * 1000);
  }
  private updateScore(streak: number): void {
    const score = document.getElementById('total-score') as HTMLElement;
    const scoreIncrease = document.getElementById('score-increase') as HTMLElement;

    switch (streak) {
      case -1: scoreIncrease.innerHTML = '+10 points per answer'; break;
      case 0: this.totalScore += 10; scoreIncrease.innerHTML = '+10 points per answer'; break;
      case 1: this.totalScore += 20; scoreIncrease.innerHTML = '+20 points per answer'; break;
      case 2: this.totalScore += 30; scoreIncrease.innerHTML = '+30 points per answer'; break;
      default: this.totalScore += 40; scoreIncrease.innerHTML = '+40 points per answer';
    }
    score.innerHTML = String(this.totalScore);
  }
  private setGameData(words: Word[]): void {
    this.gameData = words;
  }
  private showResults(): void {
    new Audio('../assets/sound/end-of-round.mp3').play();
    const appContainer = document.getElementById('app');
    const resultsHtml = `
    <div id="resultsContainer" class="gameContainer">
      <h3>Your score is ${this.totalScore}</h3>
      <div class="resultsTable">
        <div class="resultsRow">
          <div>
            <span class="material-icons" style="color:green;">check</span>
            <span><b>Correct Answers:</b></span>
          </div>
          <div>${this.correctAnsweredWords.map((word) => Sprint.generateResults(word)).join('')}</div>
        </div>

        <div>
          <div>
            <span class="material-icons" style="color:red;">error</span>
            <span><b>Inorrect Answers:</b></span>
          </div>
          <div>${this.incorrectAnsweredWords.map((word) => Sprint.generateResults(word)).join('')}</div>
        </div>

      </div>
      <div class="gameBackBtn" id="backBtn">Back to Games</div>
    </div>
  `;
    (appContainer as HTMLElement).innerHTML = resultsHtml;
    document.getElementById('backBtn')?.addEventListener('click', Sprint.goToGames.bind(this));
  }
  private static generateResults(word: Word): string {
    return `
    <div>
      <span>${word.word}</span>
      <span> - </span>
      <span>${word.wordTranslate}</span>
    </div>`;
  }

  private static goToGames(): void {
    new Games().openPage(); // todo - use router??
  }
  private static changeLights(n = 0) {
    const lights = (<HTMLElement>document.getElementById('score-increase-light')).childNodes as NodeList;
    if (n === 0) {
      for (let i = 0; i < 3; i++) {
        (<HTMLElement>lights[i]).style.background = 'rgb(73, 65, 65)';
      }
    }
    for (let i = 0; i < n; i++) {
      (<HTMLElement>lights[i]).style.background = 'green';
    }
  }
}

export default Sprint;
