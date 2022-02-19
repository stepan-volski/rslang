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

    this.renderStatSchedule(stat.optional.all.newWordsPerDay, stat.optional.all.totalLearnedWordsPerDay);
  }

  static renderStatSchedule(arrStat1: number[], arrStat2: number[]): void {
    const canvas1 = document.getElementById('canvas1') as HTMLCanvasElement;
    const canvas2 = document.getElementById('canvas2') as HTMLCanvasElement;

    const ctx1 = canvas1.getContext('2d') as CanvasRenderingContext2D;
    const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;

    function renderCanvas(ctx: CanvasRenderingContext2D, data: number[]) {
      const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
      ctx.fillStyle = 'black'; // Задаём чёрный цвет для линий
      ctx.lineWidth = 2.0; // Ширина линии
      ctx.beginPath(); // Запускает путь
      ctx.moveTo(30, 10); // Указываем начальный путь
      ctx.lineTo(30, 460); // Перемешаем указатель
      ctx.lineTo(500, 460); // Ещё раз перемешаем указатель
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.font = '22px serif';
      ctx.fillText('Words', 40, 40);
      ctx.fillText('Days', 440, 440);
      ctx.font = '14px serif';
      for (let i = 0; i < 15; i++) {
        ctx.fillText(`${(15 - i) * 8}`, 4, i * 31);
        ctx.beginPath();
        ctx.moveTo(25, i * 31);
        ctx.lineTo(30, i * 31);
        ctx.stroke();
      }
      for (let i = 0; i < 15; i++) {
        ctx.fillText(String(labels[i]), 50 + i * 30, 475);
      }
      const data1 = arrStat1;
      const data2 = arrStat2;
      ctx.fillStyle = 'blue';
      for (let i = 0; i < data1.length; i++) {
        const dp = data[i];
        console.log(data);
        ctx.fillRect(43 + i * 30, 460 - dp * 4, 20, dp * 4);
      }
    }
    renderCanvas(ctx1, arrStat1);
    renderCanvas(ctx2, arrStat2);
  }
}

export default Statistics;
