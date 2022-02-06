import {
  ICreateUserWord, ILoggedUser, IUser, Word,
} from './interfaces';

const baseUrl = 'https://rs-lang-application.herokuapp.com';
const words = `${baseUrl}/words`;
const users = `${baseUrl}/users`;

function getCurrentUser(): ILoggedUser {  // move function to another place
  return JSON.parse(localStorage.getItem('user') || '');
}

export async function getWords(groupNumber: number, pageNumber: number): Promise<Word[]> {
  const response = await fetch(`${words}?group=${groupNumber}&page=${pageNumber}`, {
    method: 'GET',
  });
  return response.json();
}

export async function getWordbyId(id: string): Promise<Word[]> {
  const response = await fetch(`${words}/${id}`, {
    method: 'GET',
  });
  return response.json();
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
  return response.json();
}

export async function createUserWord(userWord: ICreateUserWord): Promise<void> {
  const response = await fetch(`${users}/${userWord.userId}/words/${userWord.wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userWord.userWord),
  });
  await response.json();
}

export async function updateUserWord(userWord: ICreateUserWord): Promise<void> {
  const response = await fetch(`${users}/${userWord.userId}/words/${userWord.wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userWord.userWord),
  });
  await response.json();
}

// must use create api for new words and update api for already created words
export async function markWordAsDifficult(wordId: string): Promise<void> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify('difficult'),    // 'difficult' = word is difficulte
  });
  await response.json();
}

// must use update api for already created words
export async function unmarkWordAsDifficult(wordId: string): Promise<void> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(''), // '' = word is not difficult
  });
  await response.json();
}

// need to write this method
export async function getAggregatedWords(groupNumber: number, pageNumber: number): Promise<Word[]> {
  const response = await fetch(`${words}?group=${groupNumber}&page=${pageNumber}`, {
    method: 'GET',
  });
  return response.json();
}
