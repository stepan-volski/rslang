type Word = {
  id: string;
  group: string;
  page: string;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  userWord?: UserWord;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
};

type UserWord = {
  isDifficult: boolean;
  isLearnt: boolean;
};

export default Word;
