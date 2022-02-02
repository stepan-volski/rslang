import Page from './abstract/page';

class Games extends Page {
  constructor() {
    super('Games');
  }

  render(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = `<div id="${pageName.toLowerCase()}Container">${pageName} container is here</div>`;
  }
}

export default Games;
