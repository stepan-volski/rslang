import { createUser } from '../service/userApi';
import { logInUser } from '../utils/loginUtils';
import { registrationLayout } from './authorizationLayout';

class RegistrationForm {
  nameField: HTMLInputElement | null;
  passwordField: HTMLInputElement | null;
  emailField: HTMLInputElement | null;
  layout: string;
  formContainer: HTMLElement;
  constructor() {
    this.layout = registrationLayout;
    this.formContainer = this.renderContainer() as HTMLElement;
    this.nameField = null;
    this.emailField = null;
    this.passwordField = null;
    this.initHandlers();
  }
  initElems(): void {
    this.nameField = document.getElementById('registration-user-name') as HTMLInputElement;
    this.emailField = document.getElementById('registration-email') as HTMLInputElement;
    this.passwordField = document.getElementById('registration-password') as HTMLInputElement;
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
      name: (<HTMLInputElement> this.nameField).value,
      email: (<HTMLInputElement> this.emailField).value,
      password: (<HTMLInputElement> this.passwordField).value,
    });
    logInUser({
      password: (<HTMLInputElement> this.passwordField).value,
      email: (<HTMLInputElement> this.emailField).value,
    });
  }
  renderContainer(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = this.layout;
    container.id = 'registration-form-container';
    return container;
  }
}

export default RegistrationForm;
