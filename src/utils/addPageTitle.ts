export function addPageTitle(name: string): void {
  const header = document.querySelector('header') as HTMLElement;
  const pageTitle = document.getElementById('page-title') as HTMLElement;
  pageTitle.innerHTML = name;
  header.prepend(pageTitle);
}
