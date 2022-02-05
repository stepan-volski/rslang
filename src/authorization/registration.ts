/* eslint-disable import/no-cycle */
import { createUser } from '../service/api';
/* eslint-disable class-methods-use-this */

class Registration {
  name:HTMLInputElement;
  password:HTMLInputElement;
  email:HTMLInputElement;
  constructor() {
    this.name = document.getElementById('registration-user-name') as HTMLInputElement;
    this.email = document.getElementById('registration-email') as HTMLInputElement;
    this.password = document.getElementById('registration-password') as HTMLInputElement;
    this.initHandlers();
  }

  initHandlers():void {
    document.addEventListener('click', (event:Event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.id === 'signup-btn') {
        event.preventDefault();
        createUser({
          name: this.name.value,
          email: this.email.value,
          password: this.password.value,
        });
      }
    });
  }
}

export default Registration;
