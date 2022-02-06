import { loginUser } from '../service/api';

class LoginForm {
  passwordField: HTMLInputElement;
  emailField: HTMLInputElement;
  constructor() {
    this.emailField = document.getElementById('login-email') as HTMLInputElement;
    this.passwordField = document.getElementById('login-password') as HTMLInputElement;
    this.initHandlers();
  }

  initHandlers():void {   // move to separate method, use login utils
    document.addEventListener('click', (event:Event) => {
      const target = event.target as HTMLElement;
      if (target.id === 'login-btn') {
        event.preventDefault();
        loginUser({ password: this.passwordField.value, email: this.emailField.value });
      }
    });
  }
}
export default LoginForm;
