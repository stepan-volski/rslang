import Page from './abstract/page';

class About extends Page {
  constructor() {
    super('About');
  }

  openPage(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = `<div id="${pageName.toLowerCase()}Container">${pageName} container is here</div>`;
  }
}

export default About;
