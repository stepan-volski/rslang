class Page {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  render(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    appContainer.innerHTML = `${pageName} page is opened`;
  }
}

export default Page;
