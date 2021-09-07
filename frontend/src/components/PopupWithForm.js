function PopupWithForm({
  title,
  name,
  buttonSubmitText,
  children,
  isOpen,
  onClose,
  onSubmit,
  altClose,
  isToolTipForm,
  isSuccess,
}) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__overlay" onClick={altClose}>
        <form
          className="popup__form"
          name={`form-edit-${name}`}
          onSubmit={onSubmit}
          noValidate
        >
          <button
            className="popup__close"
            aria-label="Закрыть"
            type="reset"
            onClick={onClose}
          />
          {isToolTipForm && (
            <div
              className={`popup__auth ${!isSuccess ? "popup__auth-fail" : ""}`}
            />
          )}
          <h3
            className={`popup__edit ${
              isToolTipForm ? "popup__edit-tooltip" : ""
            }`}
          >
            {title}
          </h3>
          {children}
          {!isToolTipForm && (
            <button
              className={`popup__save ${isToolTipForm} ? 'popup__save-tooltip' : ''`}
              type="submit"
            >
              {buttonSubmitText}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
export default PopupWithForm;
