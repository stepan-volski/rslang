export interface IUser{
  name?: string,
  email: string,
  password: string
}
export interface ICreateUserWord{
  userId:string,
  wordId:string,
  word: IWord
}
export interface IWord{
  difficulty:string,
  optional: IOptional
}
export interface IOptional{
  testFieldString:'test',
  testFieldBoolean: boolean
}
