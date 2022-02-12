import LoginForm from './loginForm';
import RegistrationForm from './registrationForm';

class AuthorizationWindow {
  formReg: RegistrationForm;
  formLog: LoginForm;
  container: HTMLElement;
  constructor() {
    this.formReg = new RegistrationForm();
    this.formLog = new LoginForm();
    this.container = this.renderAuthorizationContainer();
  }

  renderAuthorizationContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'authorization-container';
    container.append(this.formLog.formContainer, this.formReg.formContainer);
    return container;
  }
}

export default AuthorizationWindow;
