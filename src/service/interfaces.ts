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

export interface ICreateUserWord{
  wordId: string,
  userWord: IUserWord
}

export interface IUserWord{
  wordId?:string,
  difficulty: string,
  optional: {
    learned?:string,
    correctAnswerCounter?:number
    incorrectAnswerCounter?:number
  }
}

export interface ILoggedUser{
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
}
export interface IResponse {
  wordId:string,
  difficulty:string,
  id:string,
  optional?:{
    learned?:string,
    correctAnswerCounter?:number
    incorrectAnswerCounter?:number
  }
}

export interface IStatistic{
  learnedWords:number
  optional:{
    day:{
      audioChallenge:{
        countNewWords:number
        trueAnswersSeriesLength:number
        trueAnswersCount:number
        wrongAnswersCount:number
      }
      sprint:{
        countNewWords:number
        trueAnswersSeriesLength:number
        trueAnswersCount:number
        wrongAnswersCount:number
      }
      words:{
        countNewWords:number
        countLearnedWords:number
      }
    }
    all?:IStatistic[]
  }
}
