/* eslint-disable import/no-cycle */
import authorizationLayout from './authorizationLayout';
import LogIn from './logIn';
import Registration from './registration';

export class Authorization {
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
    return container;
  }
}
