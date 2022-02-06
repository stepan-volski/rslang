import LoginForm from './loginForm';
import RegistrationForm from './registrationForm';
import authorizationLayout from './authorizationLayout';

class AuthorizationWindow {
  formReg: RegistrationForm;
  formLog: LoginForm;
  container: HTMLElement;
  layout: string;
  constructor() {
    this.layout = authorizationLayout;
    this.container = this.renderAuthorizationContainer();
    this.formReg = new RegistrationForm();
    this.formLog = new LoginForm();
  }

  renderAuthorizationContainer(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = this.layout;
    container.id = 'authorization-container';
    return container;
  }

  initLoginAndRegForms(): void { // temporary solution, will be removed later
    this.formReg = new RegistrationForm();
    this.formLog = new LoginForm();
  }
}

export default AuthorizationWindow;
