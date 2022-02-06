import { createUser } from '../service/api';
import { logInUser } from '../utils/loginUtils';

class RegistrationForm {
  nameField: HTMLInputElement;
  passwordField: HTMLInputElement;
  emailField: HTMLInputElement;
  constructor() {
    this.nameField = document.getElementById('registration-user-name') as HTMLInputElement;
    this.emailField = document.getElementById('registration-email') as HTMLInputElement;
    this.passwordField = document.getElementById('registration-password') as HTMLInputElement;
    this.initHandlers();
  }

  initHandlers():void { // need to move function to separate named method signUp (imported from loginUtils)
    document.addEventListener('click', (event:Event) => {
    // event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.id === 'signup-btn') {
        event.preventDefault();
        this.registerUser();
      }
    });
  }

  async registerUser(): Promise<void> {
    await createUser({
      name: this.nameField.value,
      email: this.emailField.value,
      password: this.passwordField.value,
    });
    logInUser({ password: this.passwordField.value, email: this.emailField.value });
  }
}

export default RegistrationForm;
