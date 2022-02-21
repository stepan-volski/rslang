/* eslint-disable import/no-cycle */
import { baseUrl, users } from './api';
import { ILoggedUser, IUser } from './interfaces';

export function getCurrentUser(): ILoggedUser {
  return JSON.parse(localStorage.getItem('user') || '');
}
export async function createUser(body: IUser): Promise<void> {
  const user = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  await user.json();
}
export async function getUser(id: string, token: string): Promise<void> {
  const word = await fetch(`${baseUrl}/users/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return word.json();
}
export async function updateUser(userId: string, body: IUser): Promise<void> {
  const response = await fetch(`${users}/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  await response.json();
}
export async function loginUser(user: IUser): Promise<ILoggedUser> {
  const response = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const res = await response.json();
  res.email = user.email;
  return res;
}
