import { addPageTitle } from '../utils/addPageTitle';
import Page from './abstract/page';

class Team extends Page {
  constructor() {
    super('Team');
  }

  openPage(): void {
    const pageName = this.name;

    const pageHtml = `
    <div class="teamContainer">
      <div class="teamCard">
        <img src="../assets/stepan.jpg" class="photo"></img>
        <div>
          <span><img src="../assets/git.png" class="git"></img></span>
          <span><a class="link-github" href="https://github.com/stepan-volski">Stepan Volski</a></span>
        </div>
        <div class="teamDescription">
          Was responsible for: app routing, Textbook section, Audio Challenge game, Team and Main pages.
        </div>
      </div>

      <div class="teamCard">
        <img src="../assets/andrey.png" class="photo"></img>
        <div>
          <span><img src="../assets/git.png" class="git"></img></span>
          <span><a class="link-github" href="https://github.com/andreypotkas">Andrey Potkas</a></span>
        </div>
        <div class="teamDescription">
          Was responsible for: api integration, main menu, user authorisation,
          Statistics section, Sprint game.
        </div>
      </div>

    </div>`;

    this.appContainer.innerHTML = pageHtml;
    addPageTitle(pageName);
  }
}

export default Team;
