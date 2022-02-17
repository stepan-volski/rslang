import statisticLayout from '../components/statisticLayout';
import { getStatistic } from '../service/statisticApi';
import { addPageTitle } from '../utils/addPageTitle';
import Page from './abstract/page';

class Statistics extends Page {
  layout: string;
  constructor() {
    super('Statistics');
    this.layout = statisticLayout;
  }

  openPage(): void {
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = '';
    appContainer.append(this.renderLayout());
    Statistics.updateStatistic();
    addPageTitle(this.name);
  }
  renderLayout(): HTMLElement {
    const layout = document.createElement('div');
    layout.id = 'statistic-container';
    layout.innerHTML = this.layout;
    return layout;
  }
  static async updateStatistic(): Promise<void> {
    const stat = await getStatistic();
    const { audioChallenge } = stat.optional.day;
    const { sprint } = stat.optional.day;

    (<HTMLElement>document.getElementById('day-new-words'))
      .innerHTML = `${audioChallenge.countNewWords + sprint.countNewWords} `;

    if (Number.isNaN((((audioChallenge.correctAnswersCount + sprint.correctAnswersCount)
      / (audioChallenge.incorrectAnswersCount + sprint.incorrectAnswersCount
      + audioChallenge.correctAnswersCount + sprint.correctAnswersCount))
      * 100))) {
      (<HTMLElement>document.getElementById('day-correct-answers')).innerHTML = 'not calculated yet';
    } else {
      (<HTMLElement>document.getElementById('day-correct-answers'))
        .innerHTML = `${
          (((audioChallenge.correctAnswersCount + sprint.correctAnswersCount)
        / (audioChallenge.incorrectAnswersCount + sprint.incorrectAnswersCount
        + audioChallenge.correctAnswersCount + sprint.correctAnswersCount))
        * 100).toFixed(1)
        } %`;
    }

    (<HTMLElement>document.getElementById('day-learned-words'))
      .innerHTML = `${stat.optional.day.words.countLearnedWords}`;

    (<HTMLElement>document.getElementById('audio-challenge-new-words')).innerHTML = `${audioChallenge.countNewWords}`;
    if (Object.is(((audioChallenge.correctAnswersCount / (audioChallenge.incorrectAnswersCount
      + audioChallenge.correctAnswersCount)) * 100), NaN)) {
      (<HTMLElement>document.getElementById('audio-challenge-correct-answers')).innerHTML = 'not calculated yet';
    } else {
      (<HTMLElement>document.getElementById('audio-challenge-correct-answers')).innerHTML = `
      ${((audioChallenge.correctAnswersCount / (audioChallenge.incorrectAnswersCount
      + audioChallenge.correctAnswersCount)) * 100).toFixed(1)} %`;
    }
    (<HTMLElement>document.getElementById('audio-challenge-streak'))
      .innerHTML = `${audioChallenge.correctAnswersSeriesLength}`;

    (<HTMLElement>document.getElementById('sprint-new-words')).innerHTML = `${sprint.countNewWords}`;
    if (Object.is(((sprint.correctAnswersCount / (sprint.incorrectAnswersCount
      + sprint.correctAnswersCount)) * 100), NaN)) {
      (<HTMLElement>document.getElementById('sprint-correct-answers')).innerHTML = 'not calculated yet';
    } else {
      (<HTMLElement>document.getElementById('sprint-correct-answers')).innerHTML = `
      ${((audioChallenge.correctAnswersCount / (audioChallenge.incorrectAnswersCount
      + audioChallenge.correctAnswersCount)) * 100).toFixed(1)} %`;
    }

    (<HTMLElement>document.getElementById('sprint-streak')).innerHTML = `${sprint.correctAnswersSeriesLength}`;

    let newWordsPerDay: number[] = [];
    let totalLearnedWordsPerDay: number[] = [];

    if (stat.optional.all.newWordsPerDay.length <= 2) {
      newWordsPerDay = [3, 4, 3, 9, 5, 6, 7, 6, 3, 12, 22];
    } else {
      newWordsPerDay = stat.optional.all.newWordsPerDay;
    }
    if (stat.optional.all.totalLearnedWordsPerDay.length <= 2) {
      totalLearnedWordsPerDay = [3, 4, 7, 11, 13, 19, 22, 33, 44, 55];
    } else {
      totalLearnedWordsPerDay = stat.optional.all.totalLearnedWordsPerDay;
    }

    (<HTMLElement>document.getElementById('new-words-per-day'))
      .append(this.renderStatSchedule(newWordsPerDay));
    (<HTMLElement>document.getElementById('total-learned-words-per-day'))
      .append(this.renderStatSchedule(totalLearnedWordsPerDay));
  }
  static renderStatSchedule(arrStat: number[]): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('stat-schedule');
    arrStat.forEach((e) => {
      container.append(Statistics.createScheduleColumn(e));
    });
    return container;
  }

  static createScheduleColumn(e: number): HTMLElement {
    const el = document.createElement('div');
    el.style.height = `${10 * e}px`;
    el.classList.add('all-time-stat-column');
    el.innerHTML = `${e}`;
    return el;
  }
}

export default Statistics;
