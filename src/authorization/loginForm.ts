import { logInUser, logOutUser } from '../utils/loginUtils';
import { loginLayout } from './authorizationLayout';

class LoginForm {
  passwordField: HTMLInputElement | null;
  emailField: HTMLInputElement | null;
  layout:string;
  formContainer:HTMLElement;
  constructor() {
    this.layout = loginLayout;
    this.formContainer = this.renderContainer() as HTMLElement;
    this.emailField = null;
    this.passwordField = null;
    this.initHandlers();
  }

  initHandlers():void {   // move to separate method, use login utils
    document.addEventListener('click', (event:Event) => {
      const target = event.target as HTMLElement;

      if (target.id === 'login-btn') {
        event.preventDefault();
        this.loginUser();
      }

      if (target.id === 'log-out-btn') {
        logOutUser();
      }
    });
  }
  loginUser():void {
    logInUser({
      password: (<HTMLInputElement> this.passwordField).value,
      email: (<HTMLInputElement> this.emailField).value,
    });
    document.getElementById('authorization-btn')?.remove();
  }
  renderContainer(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = this.layout;
    container.id = 'login-form-container';
    return container;
  }
  initElems(): void {
    this.emailField = document.getElementById('login-email') as HTMLInputElement;
    this.passwordField = document.getElementById('login-password') as HTMLInputElement;
  }
}
export default LoginForm;
