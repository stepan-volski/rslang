export function isUserLoggedIn(): boolean {
  return (!!localStorage.getItem('loggedUser'));
}
