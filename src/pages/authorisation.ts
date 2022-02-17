import AuthorizationWindow from '../authorization/authorizationWindow';
import LoginForm from '../authorization/loginForm';
import RegistrationForm from '../authorization/registrationForm';
import { authorizationShowHide } from '../utils/loginUtils';

class Authorisation {
  auth: AuthorizationWindow;
  constructor() {
    this.initHandlers();
    this.auth = new AuthorizationWindow();
    this.openPage();
  }
  initHandlers(): void {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      event.preventDefault();

      if (target.id === 'authorization-btn') {
        this.auth.formLog.initElems();
        this.auth.formReg.initElems();
      }

      if (target.id === 'close-modal') {
        authorizationShowHide(document.getElementById('authorization-container') as HTMLElement);
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
    document.body.appendChild(this.auth.container);
  }
}

export default Authorisation;
