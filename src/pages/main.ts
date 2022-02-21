import { addPageTitle } from '../utils/addPageTitle';
import Page from './abstract/page';

class Main extends Page {
  constructor() {
    super('Main');
  }

  openPage(): void {
    const pageName = this.name;

    const pageHtml = `
    <div class="mainPageContainer">
      <h1>Welcome to RS Lang!</h1>
      <div>
        This app allows students to learn new English words and track their progress using the following instruments.
      </div>

      <h2>Games</h2>
      <div>
        Games allow you to learn new words in a fun and challenging way.
        Select a difficulty level or use the page from the textbook as a source of words.
      </div>

      <h2>Textbook</h2>
      <div>
        This section allows you too see multiple words divided into 6 levels according to their difficulty.
        Logged users received access to game statistics for each word card, as well as the possibility for
        marking each word as Learned or Difficult.
      </div>

      <h2>Statistics</h2>
      <div>
        Track you progress using the Statistics section, which gives you the access to you daily amount of
        learned words and game victories, as well as long term display of your overall progression.
        The section is available for logged users only!
      </div>

    </div>`;

    this.appContainer.innerHTML = pageHtml;
    addPageTitle(this.name);
  }
}

export default Main;
