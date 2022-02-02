import Page from './abstract/page';

class Statistics extends Page {
  constructor() {
    super('Statistics');
  }

  render(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = `<div id="${pageName.toLowerCase()}Container">${pageName} container is here</div>`;
  }
}

export default Statistics;
