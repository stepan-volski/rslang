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
  difficulty: string,
  optional: Record<string, unknown>
}

export interface ILoggedUser{
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
}
