export const loginLayout = `
<button id="close-modal">&#10060;</button>
<form action='https://rs-lang-application.herokuapp.com/users'>
<h2>Login</h2>

    <label for="psw"><b>Password</b></label>
    <input id="login-password" type="password" placeholder="Enter password" name="psw" required minlength="8">

    <label for="email"><b>Email</b></label>
    <input id="login-email" type="email" placeholder="Enter email" name="email" required>

    <button type="submit" id="login-btn">Log in</button>
    <p>Don't have an account? <button id="registration-form-btn">sign in</button></p>

</form>

`;
export const registrationLayout = `
<button id="close-modal">&#10060;</button>
<form action='https://rs-lang-application.herokuapp.com/users'>
<h2>Registration</h2>

    <label for="user-name"><b>Name</b></label>
    <input id="registration-user-name" type="text" placeholder="name" name="user-name" required>

    <label for="psw"><b>Password</b></label>
    <input id="registration-password" type="password" placeholder="password" name="psw" required minlength="8">

    <label for="email"><b>Email</b></label>
    <input id="registration-email" type="email" placeholder="email"
     name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$" title="wadaw">

    <button type="submit" id="signup-btn">Sign up</button>
    <p>Already have an account? <button id="login-form-btn">login</button></p>
</form>

`;
