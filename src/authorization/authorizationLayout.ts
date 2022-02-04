const authorizationLayout = `
<form action='https://rs-lang-application.herokuapp.com/users'>
<h2>Форма регистрации</h2>
    <p>Пожалуйста, заполните эту форму, чтобы создать учетную запись.</p>
    
    <label for="user-name"><b>Name</b></label>
    <input id="registration-user-name" type="text" placeholder="Введите имя" name="user-name" required>

    <label for="psw"><b>Пароль</b></label>
    <input id="registration-password" type="password" placeholder="Введите пароль" name="psw" required>

    <label for="email"><b>Email</b></label>
    <input id="registration-email" type="text" placeholder="Введите вашу почту" name="email" required>

    <button type="submit" id="signup-btn">Регистрация</button>
</form>

<form action='https://rs-lang-application.herokuapp.com/users'>
<h2>Форма входа</h2>
    <p>Пожалуйста, заполните эту форму, чтобы войти.</p>

    <label for="psw"><b>Пароль</b></label>
    <input id="login-password" type="password" placeholder="Введите пароль" name="psw" required>

    <label for="email"><b>Email</b></label>
    <input id="login-email" type="text" placeholder="Введите вашу почту" name="email" required>

    <button type="submit" id="login-btn">Войти</button>
</form>
`;
export default authorizationLayout;
