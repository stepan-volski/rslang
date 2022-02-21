export type Word = {
  id: string;
  _id?: string;
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
  userWord?: IUserWord;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
};

export interface IUser{
  name?: string,
  email: string,
  password: string
}

export interface IUserWord{
  wordId?:string
  difficulty: string
  optional: {
    learned:boolean
    learningProgress: number
    correctAnswerCounter:number
    incorrectAnswerCounter:number
  }
}

export interface ILoggedUser{
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
  email?: string
}
export interface IResponse {
  wordId:string,
  difficulty:string,
  id:string,
  optional:{
    learned: boolean,
    learningProgress: number
    correctAnswerCounter: number
    incorrectAnswerCounter: number
  }
}

export interface IStatistic{
  learnedWords:number
  optional:{
    day:{
      audioChallenge:{
        countNewWords:number
        correctAnswersSeriesLength:number
        correctAnswersCount:number
        incorrectAnswersCount:number
      }
      sprint:{
        countNewWords:number
        correctAnswersSeriesLength:number
        correctAnswersCount:number
        incorrectAnswersCount:number
      }
      words:{
        countNewWords:number
        countLearnedWords:number
        correctAnswersCount:number
        incorrectAnswersCount:number
      }
      currentDay: number
    }
    all:{
      newWordsPerDay: number[]
      totalLearnedWordsPerDay: number[]
    }
  }
}
