import { words } from './api';
import { Word } from './interfaces';

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
