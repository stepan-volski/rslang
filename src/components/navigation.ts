function navigationFunc(): void {
  const controlNavBtn = document.getElementById('control-btn-nav') as HTMLElement;
  const navigation = document.getElementById('main-navigation') as HTMLElement;
  const navBtns = navigation.querySelectorAll('button') as NodeList;
  const navItemsText = navigation.querySelectorAll('.nav-item-text') as NodeList;
  let isHide = true;

  document.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLElement;

    if (target === controlNavBtn) {
      navigation.classList.toggle('navigation-hide');
      navigation.classList.toggle('navigation-show');

      if (isHide) {
        setTimeout(() => {
          for (let i = 0; i < navItemsText.length; i++) {
            if ((<HTMLElement>navBtns[i]).dataset.page) {
              (<HTMLElement>navItemsText[i]).innerHTML = `${(<HTMLElement>navBtns[i]).dataset.page}`;
            } else {
              (<HTMLElement>navItemsText[i]).innerHTML = 'RS Lang';
            }
          }
          isHide = false;
        }, 500);
      } else {
        for (let i = 0; i < navItemsText.length; i++) {
          (<HTMLElement>navItemsText[i]).innerHTML = '';
        }
        isHide = true;
      }
    }
  });
}
export default navigationFunc;
