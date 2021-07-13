import './index.css';
import { Card } from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/api.js";
import {popupOpenProfile, inputProfileName,
        inputProfileInfo, popupOpenImage,
        formElementProfile, formElementImage,
        submitButtons, className, popupOpenAvatar, formElementAvatar} from "../utils/constants.js";

//Добавляем класс для проверки валидации полей
const profileFormValidity = new FormValidator(className, formElementProfile);
const cardFormValidity = new FormValidator(className, formElementImage);
const avatarFormValidity = new FormValidator(className, formElementAvatar)
//Запускаем так или через функции
cardFormValidity.enableValidation()
profileFormValidity.enableValidation()
avatarFormValidity.enableValidation()

const userInfo = new UserInfo(
    {
        userNameSelector: '.profil__name',
        userAboutSelector: '.profil__profession',
        userAvatarSelector: '.profil__avatar'
    }
)

const api = new Api({
    url: 'https://mesto.nomoreparties.co/v1/cohort-22',
    token: 'c64c7158-2414-4469-9e6c-496f1ef4fdaa'
})

const popupImage = new PopupWithImage('.popup_type_add-card');
let cardToRemove = null;
function createCard(item, templateSelector) {
    const newCard = new Card(
        item,
        templateSelector,
        popupImage.open.bind(popupImage),

        {
            handleRemoveClick: () => {
                popupRemove.openPopup();
                cardToRemove = newCard;
            },
            handleCardLike: () => {
                api.setLike(newCard)
                    .then((res) => newCard.setCounterOfLikes(res.likes.length))
                    .catch((err) => console.log(err));
            },
            handleCardDislike: () => {
                api.deleteLike(newCard)
                    .then((res) => newCard.setCounterOfLikes(res.likes.length))
                    .catch((err) => console.log(err));
            }
        },

        {id: userInfo.id},

    );

    return newCard.generateCard();
}

const cardSection = new Section({
    renderer: item => {
        const generatedCard = createCard(item, '.template');
        cardSection.setItem(generatedCard, true);
    }
},'.elements');


api.getInitialData()
    .then(data => {
        const [promiseGetUser, promiseGetCards] = data;
        userInfo.setUserInfo(promiseGetCards);
        cardSection.renderItems(promiseGetUser);
        })
    .catch((err) => console.log(err));

function checkImage(link) {
  return new Promise((resolve,reject) => {
    const img = document.createElement('img');
    img.src = link;
    img.onload = resolve;
    img.onerror = reject;
  })
}

function addCardApi(formValues) {
    api.addCard({name:formValues.title, link:formValues.link})
        .then((newCard)=> {
            const generatedCard = createCard(newCard, '.template');
            cardSection.setItem(generatedCard);
            popupCard.closePopup();
        })
        .catch((err) => console.log(err));
}

const popupCard = new PopupWithForm({
    popupSelector: '.popup_type_add-image',
    submitButtons,
    handleFormSubmit: (formValues) => {
        checkImage(formValues.link)
            .then(()=> {
                popupCard.renameButtonName();
                addCardApi(formValues);
            })
            .catch(() => console.log('Ошибка адреса'));
    },
});

function getAvatar(formValues) {
    api.updateAvatar(formValues.link)
        .then((getData) => {
            userInfo.setUserInfo(getData);
            popupAvatar.closePopup();
        })
        .catch((err) => console.log(err));
}

const popupAvatar = new PopupWithForm({
    popupSelector: '.popup_type_add-avatar',
    submitButtons,
    handleFormSubmit: (formValues) => {
        checkImage(formValues.link)
            .then(()=> {
                popupAvatar.renameButtonName();
                getAvatar(formValues);
            })
            .catch(() => console.log('Ошибка адреса'));
    },

})

const popupProfile = new PopupWithForm({
    popupSelector: '.popup_type_add-profile',
    submitButtons,
    handleFormSubmit: (formValues) => {
        popupProfile.renameButtonName();
        api.setUserInfo(formValues)
            .then((updatedUser) => {
                userInfo.setUserInfo(updatedUser);
                popupProfile.closePopup();
            })
            .catch((err) => console.log(err));
    },
});

const popupRemove = new PopupWithForm({
    popupSelector: '.popup_type_delete',
    submitButtons,
    handleFormSubmit: () => {
        popupRemove.renameButtonName();
        api.deleteCard(cardToRemove)
            .then(() => {
                cardToRemove.removeCard();
                popupRemove.closePopup();
            })
            .catch((err) => console.log(err));
    }
});

popupImage.setEventListeners();
popupProfile.setEventListeners();
popupCard.setEventListeners();
popupRemove.setEventListeners();
popupAvatar.setEventListeners();


function setPopupProfileInputs() {
    inputProfileName.value = userInfo.getUserInfo().userName;
    inputProfileInfo.value = userInfo.getUserInfo().userAbout;
}

function handleEditAvatar() {
  popupAvatar.openPopup();
}

function handleEditProfile() {
    setPopupProfileInputs()
  popupProfile.openPopup();

}

function handleAddCard() {
  popupCard.openPopup();
}

popupOpenAvatar.addEventListener('click', handleEditAvatar);
popupOpenProfile.addEventListener('click', handleEditProfile);
popupOpenImage.addEventListener('click', handleAddCard);









































