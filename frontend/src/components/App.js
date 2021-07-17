import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import '../index.css';
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api";
import auth from "../utils/auth"
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import DeleteCardPopup from "./DeleteCardPopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoToolTip from "./InfoTooltip";


function App() {
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
    const [isDeletePopup, setDeletePopup] = React.useState(false)
    const [currentUser, setCurrentUser] = React.useState({})
    const [selectedCard, setSelectedCard] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [cardToDelete, setCardToDelete] = React.useState({});
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
    const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = React.useState(false);
    const history = useHistory();
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [email, setEmail] = React.useState("");

    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, cards]) => {
                setCurrentUser(userData);
                setCards(cards);
            })
            .catch((err) => {
                console.log('ошибка тут');
            });
    }, []);

    function handleUpdateUser(user){
        api.setUserInfo(user)
            .then((update) =>{
                setCurrentUser({
                    ...currentUser,
                    name: update.name,
                    about: update.about,
                })
                closeAllPopups()
            })
            .catch((err) =>{
                console.log(err, true)
            })
    }
    function handleUpdateAvatar({avatar}){
        api.updateAvatar(avatar)
            .then((update) =>{
                setCurrentUser({
                    ...currentUser,
                    avatar: update.avatar
                })
                closeAllPopups()
            })
            .catch((err) =>{
                console.log(err, true)
            })
    }
    function handleAddCard(card){
        api.addCard(card)
            .then((update)=>{
                setCards([update, ...cards])
                closeAllPopups()
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }
    function handleDeleteClick(card){
        setDeletePopup(true)
        setCardToDelete(card);
    }

    function closeAllPopups() {
        setEditAvatarPopupOpen(false);
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setDeletePopup(false)
        setSelectedCard({});
        setIsInfoTooltipPopupOpen(false)
    }

    function closeOverlay(evt){
        if(evt.target === evt.currentTarget){
            closeAllPopups()
        }
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err)=>{
                console.log(err, true)
            })

    }

    function handleCardDelete(card) {
        api.deleteCard(card)
            .then(() => {
                setCards(cards.filter((state) => state._id !== card._id)
                );
                closeAllPopups()
            })
            .catch((err)=>{
                console.log(err, true)
            })
    }
    React.useEffect(()=>{
        function handleEscClose(evt) {
            if(evt.key === 'Escape'){
                closeAllPopups()
            }
        }
        document.addEventListener('keyup', handleEscClose);
    }, [])

    function handleLogin(email, password) {
        auth
            .authorize(email, password)
            .then((res) => {
                setLoggedIn(true);
                localStorage.setItem("jwt", res.token);
                checkUserToken();
                history.push("/");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleRegister(email, password) {
        auth
            .register(email, password)
            .then(() => {
                setEmail(email);
                history.push("/sign-in");
                setIsInfoTooltipSuccess(true);
            })
            .catch(() => {
                setIsInfoTooltipSuccess(false);
            })
            .finally(() => {
            setIsInfoTooltipPopupOpen(true)
        })
    }

    function handleLogOut() {
        setLoggedIn(false);
        localStorage.removeItem("jwt");
        setEmail("");
    }

    function checkUserToken() {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            auth
                .getContent(jwt)
                .then((res) => {
                    if (res) {
                        setLoggedIn(true);
                        setEmail(res.data.email);
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }


    React.useEffect(() => {
        checkUserToken();
    }, []);

    return (
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>
                {loggedIn && (
                    <Header
                        link='/sign-in'
                        email={email}
                        headingLink="Выйти"
                        handleLogOut={handleLogOut}

                    />
                )}
                <Switch>
                    <Route path='/sign-up'>
                        <Header headingLink="Войти" link="/sign-in" />
                        <Register handleRegister={handleRegister}/>
                    </Route>

                    <Route path='/sign-in'>
                        <Header headingLink="Регистрация" link="/sign-up" />
                        <Login handleLogin={handleLogin}/>
                    </Route>

                    <ProtectedRoute
                        path='/'
                        exact
                        component={Main}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        cards={cards}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleDeleteClick}
                        loggedIn={loggedIn}
                    />
                </Switch>
                <Footer/>
                <EditProfilePopup isOpen={isEditProfilePopupOpen}
                                  onClose={closeAllPopups}
                                  onUpdateUser={handleUpdateUser}
                                  altClose={closeOverlay}
                />
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                                 onClose={closeAllPopups}
                                 onUpdateAvatar={handleUpdateAvatar}
                                 altClose={closeOverlay}
                />
                <AddPlacePopup isOpen={isAddPlacePopupOpen}
                               onClose={closeAllPopups}
                               onAddPlace={handleAddCard}
                               altClose={closeOverlay}
                />

                <DeleteCardPopup isOpen={isDeletePopup}
                                 onClose={closeAllPopups}
                                 card={cardToDelete}
                                 onSubmitDelete={handleCardDelete}
                />

                <ImagePopup card={selectedCard} onClose={closeAllPopups} altClose={closeOverlay}/>

                <InfoToolTip isOpen={isInfoTooltipPopupOpen}
                             onClose={closeAllPopups}
                             isSuccess={isInfoTooltipSuccess}
                             isToolTipForm={true}
                />

            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;
