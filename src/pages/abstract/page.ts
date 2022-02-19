class Page {
  name: string;
  appContainer: HTMLElement;
  pageContainer: HTMLElement | null = null;

  constructor(name: string) {
    this.name = name;
    this.appContainer = document.getElementById('app') as HTMLElement;
  }
}

export default Page;
