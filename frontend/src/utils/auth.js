class Auth {
    constructor({ url }) {
        this._url = url;
    }

    _checkData (res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }

    register(email, password){
        return fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(this._checkData)

    }

    authorize(email, password){
        return fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(this._checkData)
    };

    getContent(token){
        return fetch(`${BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${token}`
            }
        })
            .then(this._checkData)
    }
}

export const BASE_URL = 'https://api.sviridova.students.nomoredomains.club';
const auth = new Auth({
    url: "https://api.sviridova.students.nomoredomains.club"
});

export default auth;
