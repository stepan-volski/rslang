import AuthorizationWindow from '../authorization/authorizationWindow';
import Page from './abstract/page';

class Authorisation extends Page {
  constructor() {
    super('Authorisation');
  }

  openPage(): void {
    const pageName = this.name;
    const appContainer = document.getElementById('app') as HTMLElement;
    const auth = new AuthorizationWindow();
    appContainer.innerHTML = '';
    appContainer.appendChild(auth.container);
    auth.initLoginAndRegForms();
  }
}

export default Authorisation;
