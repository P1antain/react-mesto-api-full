import {apiSettings} from "./constants.js";

class Api {
    constructor (options) {
        this._url = options.url;
    }

    _checkData (res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(this._checkData);
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(this._checkData);
    }

    getInitialData() {
        return Promise.all([this.getInitialCards(), this.getUserInfo()]);
    }

    setUserInfo(user) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: user.name,
                about: user.about
            })
        })
            .then(this._checkData);
    }

    addCard(card) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: card.name,
                link: card.link
            })
        })
            .then(this._checkData);
    }

    deleteCard (card) {
        return fetch(`${this._url}/cards/${card._id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(this._checkData);

    }

    setLike(card) {
        return fetch(`${this._url}/cards/likes/${card._id}`, {
            method: 'PUT',
            credentials: 'include',
        })
            .then(this._checkData);
    }

    deleteLike(card) {
        return fetch(`${this._url}/cards/likes/${card._id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(this._checkData);
    }

    updateAvatar(link) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                avatar: link
            })
        })
            .then(this._checkData);
    }
    changeLikeCardStatus(card, likeCardStatus) {
        return fetch(`${this._url}/cards/likes/${card._id}`, {
            method: (likeCardStatus ? "PUT": "DELETE"),
            credentials: 'include',
        }).then(this._checkData);
    }
}

const api = new Api(apiSettings);
export default api
