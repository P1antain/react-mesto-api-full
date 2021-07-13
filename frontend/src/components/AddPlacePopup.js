import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({isOpen, onClose, altClose ,onAddPlace}){
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    React.useEffect(()=>{
        setName('');
        setLink('');
    }, [isOpen])

    function handleAddPlaceSubmit(evt) {
        evt.preventDefault();
        onAddPlace({ name, link });
    }

    function handleChangeTitle(evt) {
        setName(evt.target.value);
    }

    function handleChangeLink(evt) {
        setLink(evt.target.value);
    }

    function handleInputSelect(evt){
        evt.target.select()
    }
    return(
        <PopupWithForm
            title="Новое место"
            name="card"
            buttonSubmitText="Создать"
            isOpen={isOpen}
            onClose={onClose}
            altClose={altClose}
            onSubmit={handleAddPlaceSubmit}
        >
            <section className="popup__section">
                <input className="popup__input popup__input_type_name"
                       type="text"
                       placeholder="Название"
                       name="name" value={name}
                       minLength="2" maxLength="40"
                       onChange={handleChangeTitle}
                       onFocus={handleInputSelect}
                       required
                />
                <span className="popup__input-error"/>
            </section>
            <section className="popup__section">
                <input className="popup__input popup__input_type_profession"
                       type="url"
                       placeholder="Ссылка на картинку"
                       name="about" value={link}
                       minLength="2" maxLength="200"
                       onChange={handleChangeLink}
                       onFocus={handleInputSelect}
                       required
                />
                <span className="popup__input-error"/>
            </section>
        </PopupWithForm>
    )
}

export default AddPlacePopup