/* eslint-disable import/no-cycle */
import ChallengeQuestion from '../games/abstract/challengeQuestion';
import AudioChallenge from '../games/audioChallenge';
import Sprint from '../games/sprint';
import { Word } from '../service/interfaces';
import { getAggregatedWords } from '../service/usersWordsApi';
import { getWords } from '../service/wordsApi';
import { isUserLoggedIn } from './loginUtils';

function shuffleArray(arr: unknown[]): unknown[] {
  const array = arr;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomNumber(min: number, max: number): number {
  const num = Math.random() * (max - min) + min;
  return Math.trunc(num);
}

export function generateQuestions(gameData: Word[]): ChallengeQuestion[] {
  const questions: ChallengeQuestion[] = [];
  const words = shuffleArray(gameData) as Word[];

  words.forEach((word: Word) => {
    let answers: string[] = [];
    const question = new ChallengeQuestion();
    question.questionWord = word;
    answers.push(word.wordTranslate);

    while (answers.length < 4) {
      const answerWord = words[getRandomNumber(0, words.length)].wordTranslate;
      if (!answers.includes(answerWord)) {
        answers.push(answerWord);
      }
    }

    answers = shuffleArray(answers) as string[];
    question.answers = answers;
    questions.push(question);
  });

  return questions;
}

async function collectWordsForGame(group: number, page: number): Promise<Word[]> {
  const gameData: Word[] = [];
  let currentPage = page;
  const isUserLogged = isUserLoggedIn();

  while (gameData.length < 20 && currentPage > -1) {
    // eslint-disable-next-line no-await-in-loop
    const words = (isUserLogged) ? await getAggregatedWords(group, currentPage) : await getWords(group, currentPage);
    const notLearntWords = words.filter((word) => !word.userWord?.optional.learned);

    notLearntWords.forEach((word) => {
      if (gameData.length < 20) {
        gameData.push(word);
      }
    });
    currentPage--;
  }
  return gameData;
}

// todo - unite into single method?
export async function launchGameFromBook(currentGroup: number, currentPage: number, gameType: string): Promise<void> {
  if (gameType === 'sprint') {
    console.log('sprint started');
  }

  if (gameType === 'challenge') {
    const words = await collectWordsForGame(currentGroup, currentPage);
    const game = new AudioChallenge(words);
    game.startGame();
  }
}
async function getWordsForSprint(page: number, group: number, isUserLogged: boolean) {
  const arr:Promise<Word[]>[] = [];

  switch (isUserLogged) {
    case true:
      for (let i = 0; i < 5; i++) {
        if ((page + i) < 29) {
          arr.push(getAggregatedWords(group, (page + i)));
        } else {
          arr.push(getAggregatedWords(group, (page - i)));
        }
      }
      break;

    default:
      for (let i = 0; i < 5; i++) {
        if ((page + i) < 29) {
          arr.push(getWords(group, (page + i)));
        } else {
          arr.push(getWords(group, (page - i)));
        }
      }
  }

  const words = (await Promise.all(arr)).flat();
  return words;
}

// todo - unite into single method?
export async function launchGameFromGames(group: number, gameType: string): Promise<void> {
  const page = getRandomNumber(0, 29);
  const isUserLogged = isUserLoggedIn();

  if (gameType === 'challenge') {
    const words = (isUserLogged) ? await getAggregatedWords(group, page) : await getWords(group, page);
    const game = new AudioChallenge(words);
    game.startGame();
  }

  if (gameType === 'sprint') {
    const game = new Sprint();
    const words = await getWordsForSprint(page, group, isUserLogged);
    game.startGame(words);
  }
}
