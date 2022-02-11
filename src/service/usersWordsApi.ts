/* eslint-disable max-len */
import { getCurrentUser } from '../utils/loginUtils';
import { users } from './api';
import { IResponse, IUserWord, Word } from './interfaces';
import { decreaseCountLearnedWords, increaseCountLearnedWords } from './statisticApi';

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
  word.difficulty = 'notDifficult';
  if (word.optional.learningProgress >= 3) {
    word.optional.learned = true;
    word.optional.learningProgress = 0;
    increaseCountLearnedWords();
  }
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
    difficulty: 'notDifficult',
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
    word.optional.learningProgress = 0;
    word.difficulty = 'notDifficult';
    await updateUserWord(word);
  } else {
    await createUserWord(params);
  }
  await increaseCountLearnedWords();
}

export async function unmarkWordAsLearned(userWord: string): Promise<void> {
  const word = await getUserWordById(userWord);
  word.optional.learned = false;
  word.optional.learningProgress = 0;
  await updateUserWord(word);
  await decreaseCountLearnedWords();
}

export async function incrementCorrectAnswerCounter(userWord: string): Promise<void> {
  const userWords = await getUsersWords() as IUserWord[];
  const chosenWord = userWords.filter((word) => (word.wordId === userWord));

  const params: IUserWord = {
    wordId: userWord,
    difficulty: 'notDifficult',
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
    difficulty: 'notDifficult',
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

  if ((word.difficulty === 'difficult' && word.optional.learningProgress === 5)   //  TODO - need to check what happens if word doesn't have difficulty at all
    || ((word.difficulty === 'notDifficult') && word.optional.learningProgress === 3)
  ) {
    word.optional.learned = true;
    word.optional.learningProgress = 0;
    word.difficulty = 'notDifficult';
    increaseCountLearnedWords();
  }
  updateUserWord(word);
}

export function isWordNew(word: Word): boolean {
  const wordHasCorrectAnswers = !!word.userWord?.optional.correctAnswerCounter;
  const wordHasIncorrectAnswers = !!word.userWord?.optional.incorrectAnswerCounter;
  return !(wordHasCorrectAnswers && wordHasIncorrectAnswers);
}

export async function resetWordLearnProgress(wordId: string): Promise<void> {
  const word = await getUserWordById(wordId);
  word.optional.learningProgress = 0;
  updateUserWord(word);
}
