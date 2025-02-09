// Selectors to pass into functions in external modules
export const modalSelectors = {
  modal: 'popup',
  visible: 'popup_is-opened',
  hidden: 'popup_is-animated',
  close: 'popup__close',
};

export const cardSelectors = {
  template: 'card-template',
  card: 'card',
  title: 'card__title',
  image: 'card__image',
  likeBtn: 'card__like-button',
  likeCount: 'card__like-count',
  deleteBtn: 'card__delete-button',
  likeBtnActive: 'card__like-button_is-active',
};

export const validationSelectors = {
  form: 'popup__form',
  input: 'popup__input',
  submitBtn: 'popup__button',
  disabledBtn: 'popup__button_disabled',
  inputContainer: 'popup__input-wrapper',
  inputError: 'popup__input_type_error',
  error: 'popup__error',
  errorVisible: 'popup__error_visible',
}