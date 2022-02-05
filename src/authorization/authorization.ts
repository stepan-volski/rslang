import LogIn from './logIn';
import Registration from './registration';
import authorizationLayout from './authorizationLayout';

class Authorization {
  formReg:Registration;
  formLog:LogIn;
  container:HTMLElement;
  layout:string;
  constructor() {
    this.layout = authorizationLayout;
    this.container = this.renderAuthorizationContainer();
    document.body.append(this.container);
    this.formReg = new Registration();
    this.formLog = new LogIn();
  }

  renderAuthorizationContainer():HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = this.layout;
    container.id = 'authorization-container';
    return container;
  }
}

export default Authorization;
