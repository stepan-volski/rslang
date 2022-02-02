import Word from '../entity/word';

const baseUrl = 'https://rs-lang-application.herokuapp.com';
const words = `${baseUrl}/words`;

export async function getWords(groupNumber: number, pageNumber: number): Promise<Word[]> {
  const response = await fetch(`${words}?group=${groupNumber}&page=${pageNumber}`, {
    method: 'GET',
  });
  return response.json();
}
