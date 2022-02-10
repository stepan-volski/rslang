import ChallengeQuestion from '../games/abstract/challengeQuestion';
import { Word } from '../service/interfaces';

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
