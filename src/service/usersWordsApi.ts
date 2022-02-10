import { getCurrentUser } from '../utils/loginUtils';
import { users } from './api';
import { IResponse, IUserWord, Word } from './interfaces';

export async function createUserWord(userWord: IUserWord): Promise<void> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/words/${userWord.wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      difficulty: userWord.difficulty,
      optional: {
        learned: userWord.optional.learned,
        learningProgress: userWord.optional.learningProgress,
        correctAnswerCounter: userWord.optional.correctAnswerCounter,
        incorrectAnswerCounter: userWord.optional.incorrectAnswerCounter,
      },
    }),
  });
  await response.json();
}
export async function updateUserWord(userWord: IUserWord): Promise<void> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/words/${userWord.wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      difficulty: userWord.difficulty,
      optional: {
        learned: userWord.optional.learned,
        learningProgress: userWord.optional.learningProgress,
        correctAnswerCounter: userWord.optional.correctAnswerCounter,
        incorrectAnswerCounter: userWord.optional.incorrectAnswerCounter,
      },
    }),
  });
  await response.json();
}
export async function getUsersWords(): Promise<IUserWord[]> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/words`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const userWords:IUserWord[] = [];

  const res = await response.json() as IResponse[];
  res.forEach((e:IResponse) => {
    const userWord = {
      wordId: e.wordId,
      difficulty: e.difficulty,
      optional: {
        learned: e.optional.learned,
        learningProgress: e.optional.learningProgress,
        correctAnswerCounter: e.optional.correctAnswerCounter,
        incorrectAnswerCounter: e.optional.incorrectAnswerCounter,
      },
    };
    userWords.push(userWord);
  });

  return userWords;
}
export async function getUserWordById(userWordId:string): Promise<IUserWord> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/words/${userWordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const res = await response.json() as IResponse;
  return {
    wordId: res.wordId,
    difficulty: res.difficulty,
    optional: {
      learned: res.optional.learned,
      learningProgress: res.optional.learningProgress,
      correctAnswerCounter: res.optional.correctAnswerCounter,
      incorrectAnswerCounter: res.optional.incorrectAnswerCounter,
    },
  };
}
export async function markWordAsDifficult(userWord: string): Promise<void> {
  const userWords = await getUsersWords() as IUserWord[];
  const chosenWord = userWords.filter((word) => (word.wordId === userWord));

  const params: IUserWord = {
    wordId: userWord,
    difficulty: 'difficult',
    optional: {
      learned: false,
      learningProgress: 0,
      correctAnswerCounter: 0,
      incorrectAnswerCounter: 0,
    },
  };

  if (chosenWord.length > 0) {
    const word = await getUserWordById(userWord);
    word.difficulty = 'difficult';
    await updateUserWord(word);
  } else {
    await createUserWord(params);
  }
}
export async function unmarkWordAsDifficult(userWord: string): Promise<void> {
  const word = await getUserWordById(userWord);
  word.difficulty = 'unDifficult';
  await updateUserWord(word);
}
export async function getAggregatedWords(groupNumber: number, pageNumber: number): Promise<Word[]> {
  const response = await fetch(`${users}/${getCurrentUser().userId}/aggregatedWords?group=${groupNumber}&page=${pageNumber}&wordsPerPage=20`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const arr = await response.json();
  return arr[0].paginatedResults;
}
export async function getDifficultWords(): Promise<Word[]> {
  const filter = JSON.stringify({ $or: [{ 'userWord.difficulty': 'difficult' }] });
  const response = await fetch(`${users}/${getCurrentUser().userId}/aggregatedWords?wordsPerPage=100&filter=${filter}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getCurrentUser().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const arr = await response.json();
  return arr[0].paginatedResults;
}
export async function markWordAsLearned(userWord: string): Promise<void> {
  const userWords = await getUsersWords() as IUserWord[];
  const chosenWord = userWords.filter((word) => (word.wordId === userWord));

  const params: IUserWord = {
    wordId: userWord,
    difficulty: '',
    optional: {
      learned: true,
      learningProgress: 0,
      correctAnswerCounter: 0,
      incorrectAnswerCounter: 0,
    },
  };

  if (chosenWord.length > 0) {
    const word = await getUserWordById(userWord);
    word.optional.learned = true;
    await updateUserWord(word);
  } else {
    await createUserWord(params);
  }
}
export async function unmarkWordAsLearned(userWord: string): Promise<void> {
  const word = await getUserWordById(userWord);

  word.optional.learned = false;
  await updateUserWord(word);
}
export async function incrementCorrectAnswerCounter(userWord: string): Promise<void> {
  const userWords = await getUsersWords() as IUserWord[];
  const chosenWord = userWords.filter((word) => (word.wordId === userWord));

  const params: IUserWord = {
    wordId: userWord,
    difficulty: '',
    optional: {
      learned: false,
      learningProgress: 0,
      correctAnswerCounter: 1,
      incorrectAnswerCounter: 0,
    },
  };

  if (chosenWord.length > 0) {
    const word = await getUserWordById(userWord);
    word.optional.correctAnswerCounter += 1;
    await updateUserWord(word);
  } else {
    await createUserWord(params);
  }
}
export async function incrementIncorrectAnswerCounter(userWord: string): Promise<void> {
  const userWords = await getUsersWords() as IUserWord[];
  const chosenWord = userWords.filter((word) => (word.wordId === userWord));

  const params: IUserWord = {
    wordId: userWord,
    difficulty: '',
    optional: {
      learned: false,
      learningProgress: 0,
      correctAnswerCounter: 0,
      incorrectAnswerCounter: 1,
    },
  };

  if (chosenWord.length > 0) {
    const word = await getUserWordById(userWord);
    word.optional.incorrectAnswerCounter += 1;
    await updateUserWord(word);
  } else {
    await createUserWord(params);
  }
}
export async function increaseWordLearnProgress(wordId: string): Promise<void> {
  const word = await getUserWordById(wordId);
  word.optional.learningProgress += 1;
  updateUserWord(word);
}
