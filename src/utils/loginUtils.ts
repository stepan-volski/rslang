import { loginUser } from '../service/api';
import { ILoggedUser, IUser } from '../service/interfaces';

export function isUserLoggedIn(): boolean {
  return (!!localStorage.getItem('user'));
}

export async function logInUser(user: IUser): Promise<void> {
  const loggedUser = await loginUser(user);
  localStorage.setItem('user', JSON.stringify(loggedUser));
  // + change ui?
}

export function logOutUser(): void {
  localStorage.removeItem('user');
  // + change ui?
}

export function getCurrentUser(): ILoggedUser {
  return JSON.parse(localStorage.getItem('user') || '');
}
