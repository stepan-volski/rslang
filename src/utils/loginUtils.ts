import { ILoggedUser, IUser } from '../service/interfaces';
import { loginUser } from '../service/userApi';

export function getCurrentUser(): ILoggedUser {
  return JSON.parse(localStorage.getItem('user') || '');
}
export function isUserLoggedIn(): boolean {
  return (!!localStorage.getItem('user'));
}
function renderLoggedUser(user:IUser) {
  const userContainer = document.createElement('div');
  userContainer.id = 'logged-user-container';

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
}

export async function logInUser(user: IUser): Promise<void> {
  const loggedUser = await loginUser(user);
  localStorage.setItem('user', JSON.stringify(loggedUser));
  renderLoggedUser(user);
}

export function logOutUser(): void {
  localStorage.removeItem('user');
  (<HTMLElement>document.getElementById('logged-user-container')).remove();
}
