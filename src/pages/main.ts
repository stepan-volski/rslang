import Page from './abstract/page';

class Main extends Page {
  constructor() {
    super('Main');
  }

  openPage(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = `<div id="${pageName.toLowerCase()}Container">${pageName} container is here</div>`;
  }
}

export default Main;
