export const baseUrl = 'https://rs-lang-application.herokuapp.com';
export const words = `${baseUrl}/words`;
export const users = `${baseUrl}/users`;

export function getCurrentDay(): number {
  const date = new Date();
  const currentDay = date.getDay();
  return currentDay;
}
