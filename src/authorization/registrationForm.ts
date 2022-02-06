import { createUser } from '../service/api';

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
        createUser({
          name: this.nameField.value,
          email: this.emailField.value,
          password: this.passwordField.value,
        });
      }
    });
  }
}

export default RegistrationForm;
