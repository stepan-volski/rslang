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
      .innerHTML = `${audioChallenge.countNewWords + sprint.countNewWords} ` ?? '0';

    if (Number.isNaN((((audioChallenge.correctAnswersCount + sprint.correctAnswersCount)
      / (audioChallenge.incorrectAnswersCount + sprint.incorrectAnswersCount
      + audioChallenge.correctAnswersCount + sprint.correctAnswersCount))
      * 100))) {
      (<HTMLElement>document.getElementById('day-correct-answers')).innerHTML = '0';
    } else {
      (<HTMLElement>document.getElementById('day-correct-answers'))
        .innerHTML = `${
          (((audioChallenge.correctAnswersCount + sprint.correctAnswersCount)
        / (audioChallenge.incorrectAnswersCount + sprint.incorrectAnswersCount
        + audioChallenge.correctAnswersCount + sprint.correctAnswersCount))
        * 100).toFixed(1)
        } %` ?? '0';
    }

    (<HTMLElement>document.getElementById('day-learned-words'))
      .innerHTML = `${stat.optional.day.words.countLearnedWords}` ?? '0';

    (<HTMLElement>document.getElementById('audio-challenge-new-words')).innerHTML = `${audioChallenge.countNewWords}` ?? '0';
    if (Object.is(((audioChallenge.correctAnswersCount / (audioChallenge.incorrectAnswersCount
      + audioChallenge.correctAnswersCount)) * 100), NaN)) {
      (<HTMLElement>document.getElementById('audio-challenge-correct-answers')).innerHTML = '0';
    } else {
      (<HTMLElement>document.getElementById('audio-challenge-correct-answers')).innerHTML = `
      ${((audioChallenge.correctAnswersCount / (audioChallenge.incorrectAnswersCount
      + audioChallenge.correctAnswersCount)) * 100).toFixed(1)} %`;
    }
    (<HTMLElement>document.getElementById('audio-challenge-streak'))
      .innerHTML = `${audioChallenge.correctAnswersSeriesLength}`;

    (<HTMLElement>document.getElementById('sprint-new-words')).innerHTML = `${sprint.countNewWords}`;
    if (Number.isNaN(((sprint.correctAnswersCount / (sprint.incorrectAnswersCount
      + sprint.correctAnswersCount)) * 100))) {
      (<HTMLElement>document.getElementById('sprint-correct-answers')).innerHTML = '0';
    } else {
      (<HTMLElement>document.getElementById('sprint-correct-answers')).innerHTML = `
      ${((sprint.correctAnswersCount / (sprint.incorrectAnswersCount
      + sprint.correctAnswersCount)) * 100).toFixed(1)} %`;
    }

    (<HTMLElement>document.getElementById('sprint-streak')).innerHTML = `${sprint.correctAnswersSeriesLength}` ?? '0';

    (<HTMLElement>document.getElementById('new-words-per-day'))
      .append(this.renderStatSchedule(stat.optional.all.newWordsPerDay, 10));
    (<HTMLElement>document.getElementById('total-learned-words-per-day'))
      .append(this.renderStatSchedule(stat.optional.all.totalLearnedWordsPerDay, 20));
  }

  static renderStatSchedule(arrStat: number[], size: number): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('stat-schedule');
    arrStat.forEach((e, index) => {
      if (index === (arrStat.length - 1)) {
        container.append(Statistics.createScheduleColumn(e, 1, size));
      } else {
        container.append(Statistics.createScheduleColumn(e, 0, size));
      }
    });
    return container;
  }

  static createScheduleColumn(e: number, index = 0, size: number): HTMLElement {
    const el = document.createElement('div');
    el.style.height = `${size * e}px`;
    el.classList.add('all-time-stat-column');
    if (index !== 0) {
      el.innerHTML = `&#10026; ${e}`;
    } else {
      el.innerHTML = `${e}`;
    }
    return el;
  }
}

export default Statistics;
