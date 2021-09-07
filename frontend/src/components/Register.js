import React from "react";
import { Link } from "react-router-dom";

function Register({ handleRegister }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handlePasswordEdit(evt) {
    setPassword(evt.target.value);
  }

  function handleEmailEdit(evt) {
    setEmail(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    handleRegister(email, password);
    console.log(email, password);
  }

  return (
    <div className="auth">
      <form className="auth__form" name="signup" onSubmit={handleSubmit}>
        <h2 className="auth__heading">Регистрация</h2>
        <input
          onChange={handleEmailEdit}
          value={email || ""}
          type="email"
          placeholder="Введите адрес почты"
          name="email"
          className="auth__input"
          id="email-input"
          required
        />
        <input
          onChange={handlePasswordEdit}
          value={password || ""}
          type="password"
          placeholder="Введите пароль"
          name="password"
          className="auth__input"
          id="password-input"
          required
        />
        <button type="submit" className="auth__submit">
          Зарегистрироваться
        </button>
      </form>
      <p className="auth__caption">
        Уже зарегистрированы?
        <Link to="/sign-in" className="auth__link">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;
