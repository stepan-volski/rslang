import statisticLayout from '../components/statisticLayout';
import { IStatistic } from '../service/interfaces';
import { getStatistic } from '../service/statisticApi';
import Page from './abstract/page';

class Statistics extends Page {
  layout: string;
  constructor() {
    super('Statistics');
    this.layout = statisticLayout;
  }

  openPage(): void {
    const pageName = this.name;
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
    (<HTMLElement>document.getElementById('total-learn-words'))
      .innerHTML = `${stat.learnedWords}`;
    (<HTMLElement>document.getElementById('audio-challenge-new-words'))
      .innerHTML = `${stat.optional.day.audioChallenge.countNewWords}`;
    (<HTMLElement>document.getElementById('audio-challenge-correct-answers'))
      .innerHTML = `${stat.optional.day.audioChallenge.correctAnswersCount}`;
    (<HTMLElement>document.getElementById('audio-challenge-incorrect-answers'))
      .innerHTML = `${stat.optional.day.audioChallenge.incorrectAnswersCount}`;
    (<HTMLElement>document.getElementById('audio-challenge-streak'))
      .innerHTML = `${stat.optional.day.audioChallenge.correctAnswersSeriesLength}`;

    (<HTMLElement>document.getElementById('sprint-new-words'))
      .innerHTML = `${stat.optional.day.sprint.countNewWords}`;
    (<HTMLElement>document.getElementById('sprint-correct-answers'))
      .innerHTML = `${stat.optional.day.sprint.correctAnswersCount}`;
    (<HTMLElement>document.getElementById('sprint-incorrect-answers'))
      .innerHTML = `${stat.optional.day.sprint.incorrectAnswersCount}`;
    (<HTMLElement>document.getElementById('sprint-streak'))
      .innerHTML = `${stat.optional.day.sprint.correctAnswersSeriesLength}`;

    (<HTMLElement>document.getElementById('new-words-per-day'))
      .append(this.renderStatSchedule([1, 6, 4, 6, 7, 2, 11, 3, 9])); // stat.optional.all.newWordsPerDay
    (<HTMLElement>document.getElementById('total-learned-words-per-day'))
      .append(this.renderStatSchedule([1, 2, 4, 6, 7, 8, 11, 14, 16])); // stat.optional.all.totalLearnedWordsPerDay
  }
  static renderStatSchedule(arrStat: number[]): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('stat-schedule');
    arrStat.forEach((e) => {
      container.append(Statistics.createScheduleColumn(e));
    });
    return container;
  }

  static renderStatisticDescription(): HTMLElement {
    const statDescription = document.createElement('div');
    statDescription.innerHTML = `
    <h2>statistics for all time</h2>
    <div id="schedule-titles">
      <p>newWordsPerDay</p>
      <p>totalLearnedWordsPerDay</p>
    </div>
    `;
    statDescription.id = 'stat-description';
    return statDescription;
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
