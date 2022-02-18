/* eslint-disable import/no-cycle */
import { ILoggedUser, IUser } from '../service/interfaces';
import { getStatistic } from '../service/statisticApi';
import { loginUser } from '../service/userApi';

export function hideStatNav(): void {
  const el1 = document.querySelector('div[data-page="statistics"]') as HTMLElement;
  const el2 = document.querySelector('button[data-page="statistics"]') as HTMLElement;
  el1.classList.add('inactive');
  el2.classList.add('inactive');
}
export function showStatNav(): void {
  const el1 = document.querySelector('div[data-page="statistics"]') as HTMLElement;
  const el2 = document.querySelector('button[data-page="statistics"]') as HTMLElement;
  el1.classList.remove('inactive');
  el2.classList.remove('inactive');
}

export function authorizationShowHide(el:HTMLElement): void {
  el.classList.toggle('authorization-hide');
  el.classList.toggle('authorization-show');
}
export function getCurrentUser(): ILoggedUser {
  return JSON.parse(localStorage.getItem('user') || '');
}
export function isUserLoggedIn(): boolean {
  return (!!localStorage.getItem('user'));
}
function renderLoggedUser(user:{ name: string, email: string }) {
  const userContainer = document.getElementById('logged-user-container') as HTMLElement;

  const userImage = new Image(50, 50);
  userImage.src = '../assets/userLogo.png';

  const logOutBtn = document.createElement('button');
  logOutBtn.innerHTML = 'logOut';
  logOutBtn.id = 'log-out-btn';

  userContainer.innerHTML = `
    <div>
      <div id="logged-user-name">${getCurrentUser().name}</div>
      <div id="logged-user-email">${user.email}</div>
    </div>
  `;
  userContainer.append(userImage, logOutBtn);
  (<HTMLElement>document.querySelector('header')).append(userContainer);
  showStatNav();
}
export function renderAuthorizationBtn(): void {
  const authorization = document.getElementById('authorization-container') as HTMLElement;
  const loginBtn = document.createElement('button');
  loginBtn.id = 'authorization-btn';
  loginBtn.innerHTML = 'login';
  (<HTMLElement>document.getElementById('logged-user-container')).innerHTML = '';
  ((<HTMLElement>document.getElementById('logged-user-container'))).append(loginBtn);

  document.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLElement;

    if (target === loginBtn) {
      authorizationShowHide(authorization);
    }
  });
}
export async function logInUser(user: IUser): Promise<void> {
  const loggedUser = await loginUser(user);
  localStorage.setItem('user', JSON.stringify(loggedUser));
  renderLoggedUser({ name: user.name ?? '', email: user.email });
  authorizationShowHide(document.getElementById('authorization-container') as HTMLElement);
}

export function logOutUser(): void {
  localStorage.removeItem('user');
  (<HTMLElement>document.getElementById('logged-user-container')).innerHTML = '';
  renderAuthorizationBtn();
  hideStatNav();
}

export function loadUser(): void {
  const isLog = isUserLoggedIn();
  if (isLog) {
    (<HTMLElement>document.getElementById('logged-user-container')).innerHTML = '';
    const user = getCurrentUser();
    renderLoggedUser({
      name: user.name,
      email: user.email ?? '',
    });
  } else {
    renderAuthorizationBtn();
    hideStatNav();
  }
}
