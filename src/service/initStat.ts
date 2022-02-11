import { IStatistic } from './interfaces';

const initStat: IStatistic = {
  learnedWords: 0,
  optional: {
    day: {
      audioChallenge: {
        countNewWords: 0,
        correctAnswersSeriesLength: 0,
        correctAnswersCount: 0,
        incorrectAnswersCount: 0,
      },
      sprint: {
        countNewWords: 0,
        correctAnswersSeriesLength: 0,
        correctAnswersCount: 0,
        incorrectAnswersCount: 0,
      },
      words: {
        countNewWords: 0,
        countLearnedWords: 0,
        correctAnswersCount: 0,
        incorrectAnswersCount: 0,
      },
      currentDay: 1,
    },
    all: {},
  },
};

export default initStat;
