/* eslint-disable class-methods-use-this */

class Page {
  name: string;
  appContainer: HTMLElement | null;
  pageContainer: HTMLElement | null = null;

  constructor(name: string) {
    this.name = name;
    this.appContainer = document.getElementById('app');
  }

  openPage(): void { // Question: how to correctly make sbstract class?
    //
  }
}

export default Page;
