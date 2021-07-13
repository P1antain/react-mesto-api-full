import React from "react";

function Login({ handleLogin }) {
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

        handleLogin(email, password);
    }

    return (
        <div className="auth">
            <form
                className="auth__form"
                name="login"
                onSubmit={handleSubmit}>
                <h2 className="auth__heading">Вход</h2>
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
                <button
                    type="submit"
                    className="auth__submit">
                    Войти
                </button>
            </form>
        </div>
    );
}

export default Login;