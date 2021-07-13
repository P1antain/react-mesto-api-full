function ImagePopup({ card, onClose, altClose }){

    return(
<div className={`popup popup_type_add-card ${card.link ? "popup_opened" : ""}`}>
            <div className="popup__overlay popup__overlay_card" onClick={altClose}>
                <div className="popup__form-card" >
                    <button className="popup__close popup__close_card"
                            aria-label="Закрыть" type="reset"
                            onClick={onClose}
                    />
                    <img src={`${card.link}`} alt={card.name}  className="popup__image"/>
                    <h3 className="popup__name">{card.name} </h3>
                </div>
            </div>
        </div>
    )
}

export default ImagePopup