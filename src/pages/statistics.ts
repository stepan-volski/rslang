import statisticLayout from '../components/statisticLayout';
import { getStatistic } from '../service/statisticApi';
import Page from './abstract/page';

class Statistics extends Page {
  layout: string;
  constructor() {
    super('Statistics');
    this.layout = statisticLayout;
  }

  openPage(): void {
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.append(this.renderLayout());
    Statistics.updateStatistic();
  }
  renderLayout(): HTMLElement {
    const layout = document.createElement('div');
    layout.innerHTML = this.layout;
    return layout;
  }
  static async updateStatistic(): Promise<void> {
    const stat = await getStatistic();
    const { audioChallenge } = stat.optional.day;
    const { sprint } = stat.optional.day;

    (<HTMLElement>document.getElementById('total-learn-words')).innerHTML = `${stat.learnedWords}`;

    (<HTMLElement>document.getElementById('day-new-words'))
      .innerHTML = `${audioChallenge.countNewWords + sprint.countNewWords} `;
    (<HTMLElement>document.getElementById('day-correct-answers'))
      .innerHTML = `${
        (((audioChallenge.correctAnswersCount + sprint.correctAnswersCount)
        / (audioChallenge.incorrectAnswersCount + sprint.incorrectAnswersCount
        + audioChallenge.correctAnswersCount + sprint.correctAnswersCount))
        * 100).toFixed(1)
      }`;
    (<HTMLElement>document.getElementById('day-learned-words'))
      .innerHTML = `${stat.optional.day.words.countLearnedWords}`;

    (<HTMLElement>document.getElementById('audio-challenge-new-words')).innerHTML = `${audioChallenge.countNewWords}`;
    (<HTMLElement>document.getElementById('audio-challenge-correct-answers')).innerHTML = `
      ${((audioChallenge.correctAnswersCount / (audioChallenge.incorrectAnswersCount
      + audioChallenge.correctAnswersCount)) * 100).toFixed(1)}`;
    (<HTMLElement>document.getElementById('audio-challenge-streak'))
      .innerHTML = `${audioChallenge.correctAnswersSeriesLength}`;

    (<HTMLElement>document.getElementById('sprint-new-words')).innerHTML = `${sprint.countNewWords}`;
    (<HTMLElement>document.getElementById('sprint-correct-answers')).innerHTML = `${((sprint.correctAnswersCount
      / (sprint.incorrectAnswersCount + sprint.correctAnswersCount)) * 100).toFixed(1)}`;
    (<HTMLElement>document.getElementById('sprint-streak')).innerHTML = `${sprint.correctAnswersSeriesLength}`;

    (<HTMLElement>document.getElementById('new-words-per-day'))
      .append(this.renderStatSchedule(stat.optional.all.newWordsPerDay));
    (<HTMLElement>document.getElementById('total-learned-words-per-day'))
      .append(this.renderStatSchedule(stat.optional.all.totalLearnedWordsPerDay));
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
