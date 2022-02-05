import Authorization from '../authorization/authorization';
import Word from '../entity/word';
import { ICreateUserWord, IUser } from './interfaces';

const currentUser = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZmU1NTQ5ZDVjYjkyMDAxNmE0NzUyYSIsImlhdCI6MTY0NDA1Nzk0NiwiZXhwIjoxNjQ0MDcyMzQ2fQ.2WBoUJhJIVPYp1LUcaEgr0pMe2TqexfvppnN4GALjXA",
  userId: '61fe5549d5cb920016a4752a',
};
const baseUrl = 'https://rs-lang-application.herokuapp.com';
const words = `${baseUrl}/words`;
const users = `${baseUrl}/users`;

export async function getWords(groupNumber: number, pageNumber: number): Promise<Word[]> {
  const response = await fetch(`${words}?group=${groupNumber}&page=${pageNumber}`, {
    method: 'GET',
  });
  return response.json();
}
// need to pass 'optional' object with 'difficult' and 'learned' flags
export async function createWord(userId: string, wordId: string): Promise<void> {
  const response = await fetch(`${users}/${userId}/words/${wordId}`, {
    method: 'POST',
  });
  return response.json();
}
export async function getWordbyId(id: string): Promise<Word[]> {
  const response = await fetch(`${words}/${id}`, {
    method: 'GET',
  });
  return response.json();
}
export async function createUser(body: IUser):Promise<void> {
  const user = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const content = await user.json();
  console.log(content);
}
export async function getUser(id:string, token:string):Promise<void> {
  const word = await fetch(`${baseUrl}/users/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return word.json();
}
export async function updateUser(userId:string, body: IUser, token:string):Promise<void> {
  const response = await fetch(`${users}/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const content = await response.json();

  console.log(content);
}
export async function loginUser(user:IUser): Promise<void> {
  const response = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const content = await response.json();
  console.log(content);
  localStorage.setItem('token', content.token);
  localStorage.setItem('userId', content.userId);
  currentUser.token = content.token;
  currentUser.userId = content.userId;
}
const authorization = new Authorization();

async function createUserWord(userWord:ICreateUserWord) {
  const response = await fetch(`${users}/${userWord.userId}/words/${userWord.wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userWord.word),
  });
  const content = await response.json();

  console.log(content);
}
async function updateUserWord(userWord:ICreateUserWord) {
  const response = await fetch(`${users}/${userWord.userId}/words/${userWord.wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userWord.word),
  });
  const content = await response.json();

  console.log(content);
}
/* createUserWord({
  userId: currentUser.userId,
  wordId: "5e9f5ee35eb9e72bc21af717",
  word: { "difficulty": "weak", "optional": {testFieldString: 'test', testFieldBoolean: true} }
}); */
/* updateUserWord({
  userId: currentUser.userId,
  wordId: '5e9f5ee35eb9e72bc21af717',
  word: { difficulty: 'normal', optional: { testFieldString: 'test', testFieldBoolean: true } },
}); */
