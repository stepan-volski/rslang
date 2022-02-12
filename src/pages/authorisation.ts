import AuthorizationWindow from '../authorization/authorizationWindow';
import LoginForm from '../authorization/loginForm';
import RegistrationForm from '../authorization/registrationForm';
import Page from './abstract/page';

class Authorisation extends Page {
  auth: AuthorizationWindow;
  constructor() {
    super('Authorisation');
    this.init();
    this.auth = new AuthorizationWindow();
  }
  init(): void {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      event.preventDefault();

      if (target.id === 'authorization-btn') {
        this.openPage();
        this.auth.formLog.initElems();
        this.auth.formReg.initElems();
      }

      if (target.id === 'close-modal') {
        document.getElementById('authorization-container')?.remove();
      }

      if (target.id === 'login-form-btn') {
        (<RegistrationForm> this.auth.formReg).formContainer.style.display = 'none';
        (<LoginForm> this.auth.formLog).formContainer.style.display = 'flex';
      }

      if (target.id === 'registration-form-btn') {
        (<RegistrationForm> this.auth.formReg).formContainer.style.display = 'flex';
        (<LoginForm> this.auth.formLog).formContainer.style.display = 'none';
      }
    });
  }

  openPage(): void {
    const pageName = this.name;
    document.body.appendChild(this.auth.container);
  }
}

export default Authorisation;
