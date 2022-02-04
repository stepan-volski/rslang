import Word from '../entity/word';

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

// add updateWord method
// add markWordAsDifficult method (should use updateWord)
// add markWordAsLearned method (should use updateWord)
