/* eslint-disable class-methods-use-this */
class Page {  // this page will be made into an interface
  name: string;
  appContainer: HTMLElement;
  pageContainer: HTMLElement | null = null;

  constructor(name: string) {
    this.name = name;
    this.appContainer = document.getElementById('app') as HTMLElement;
  }

  openPage(): void { // Question: how to correctly make abstract class?
    //
  }
}

export default Page;
