/* eslint-disable import/no-cycle */
import ChallengeQuestion from '../games/abstract/challengeQuestion';
import AudioChallenge from '../games/audioChallenge';
import { Word } from '../service/interfaces';
import { getAggregatedWords } from '../service/usersWordsApi';

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

  while (gameData.length < 20 && currentPage > -1) {
    // eslint-disable-next-line no-await-in-loop
    const words = await getAggregatedWords(group, currentPage);
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
