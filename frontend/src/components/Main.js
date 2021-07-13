import React from "react";
import '../index.css'
import Card from "./Card.js";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main({onEditAvatar, onEditProfile, onAddPlace, onCardClick, cards, onCardLike, onCardDelete }){

    const currentUser = React.useContext(CurrentUserContext);

    return(
        <main className="content">
            <section className="profil">
                <div className="profil__place">
                    <img src={currentUser.avatar}
                         alt="Аватар" className="profil__avatar"/>
                    <button
                        className="profil__replace"
                        onClick={onEditAvatar}/>
                </div>
                <div className="profil__info">
                    <h1 className="profil__name">{currentUser.name}</h1>
                    <button
                        className="profil__edit"
                        aria-label="Редактирование профиля"
                        type="button"
                        onClick={onEditProfile}/>
                    <p className="profil__profession">{currentUser.about}</p>
                </div>
                <button
                    className="profil__add"
                    aria-label="Добавить изображения"
                    type="button"
                    onClick={onAddPlace}/>
            </section>

            <section className="elements">
                    {cards.map((card) => {
                        return (
                            <Card key={card._id} card={card}
                                  onCardClick={onCardClick}
                                  onCardLike={onCardLike}
                                  onCardDelete={onCardDelete}
                            />
                        );
                    })}
            </section>
        </main>
    )
}
export default Main