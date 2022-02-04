/* eslint-disable import/no-cycle */
import { loginUser } from '../service/api';

/* eslint-disable class-methods-use-this */
class LogIn {
  password:HTMLInputElement;
  email:HTMLInputElement;
  constructor() {
    this.email = document.getElementById('login-email') as HTMLInputElement;
    this.password = document.getElementById('login-password') as HTMLInputElement;
    this.initHandlers();
  }

  initHandlers():void {
    document.addEventListener('click', (event:Event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.id === 'login-btn') {
        loginUser({ password: this.password.value, email: this.email.value });
      }
    });
  }
}
export default LogIn;
