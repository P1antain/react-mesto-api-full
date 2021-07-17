class Auth {
    constructor (options) {
        this._url = options.url;
    }

    _checkData (res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }

    register(data) {
        return fetch(`${this._url}/signup`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password:data.password,
            }),
        }).then(this._checkData);
    }

    authorize(data) {
        return fetch(`${this._url}/signin`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
        }).then(this._checkData);
    }

    getContent() {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            credentials: 'include',
        }).then(this._checkData);
    }
}

const auth = new Auth({
    url: "https://api.p1antain.students.nomoredomains.club"
});

export default auth;
