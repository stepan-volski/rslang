import Word from '../entity/word';
import { Authorization } from '../authorization/authorization';

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
///////////////////////////////////////////////////////
interface IUser{
  name?: string,
  email: string,
  password: string
}
interface IAuthorizedUser{
  token:string,
  userId:string
}
// registration User in Data base
export async function createUser(body: IUser):Promise<void>{
  const user = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      body:JSON.stringify(body),
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
  });
  const content = await user.json();
  console.log(content);
}

const currentUser={
  token:'',
  userId:''
}
// log user 
export const loginUser = async function (user:IUser): Promise<void> {
  const response = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  const content = await response.json();
  console.log(content);
  localStorage.setItem('token', content.token);
  localStorage.setItem('userId', content.userId);
  currentUser.token = content.token;
  currentUser.userId = content.userId;
  console.log(currentUser);
};

async function getUser(id:string, token:string) {
  const word = await fetch(`${baseUrl}/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  return word.json();
}
const authorization = new Authorization()

