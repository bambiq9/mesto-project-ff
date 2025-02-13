import '../pages/index.css';
import {
  createCard,
  removeCard,
  toggleLikeButton,
  updateLikeCount,
} from './card.js';
import {
  openModal,
  closeModal,
  overlayClickHandler,
} from './modal.js';
import { clearValidation, enableValidation } from './validation.js';
import {
  getInitialCards,
  getUserData,
  updateUserData,
  postNewCard,
  deleteCard,
  updateLike,
  updateAvatarUrl,
} from './api.js';

let userId = null;
const cardToDelete = {};

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputWrapperSelector: '.popup__input-wrapper',
  inputErrorClass: 'popup__input_type_error',
  errorSelector: '.popup__error',
  errorVisibleClass: 'popup__error_visible'
}

// DOM
// General
const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');

// Profile info
const profileImage = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Modals
const modalTypeEditAvatar = document.querySelector('.popup_type_edit-avatar');
const modalTypeEditProfile = document.querySelector('.popup_type_edit');
const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeRemoveCard = document.querySelector('.popup_type_remove-card');
const modalTypeImage = document.querySelector('.popup_type_image');
const modalImage = modalTypeImage.querySelector('.popup__image');
const modalCaption = modalTypeImage.querySelector('.popup__caption');

// Forms
const editAvatarForm = document.forms['edit-avatar'];
const editProfileForm = document.forms['edit-profile'];
const addNewPlaceForm = document.forms['new-place'];
const removeCardForm = document.forms['remove-card'];

// Show remote data update status on submit button
function toggleLoadingStatus(button, text) {
  button.textContent = text;
}

// Open avatar edit modal
function avatarEditHandler() {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationSettings);
  openModal(modalTypeEditAvatar);
}

// Submit avatar update form
function editAvatarSubmitHandler(e) {
  e.preventDefault();
  toggleLoadingStatus(e.submitter, 'Сохранение...');

  updateAvatarUrl(editAvatarForm.link.value)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(modalTypeEditAvatar);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      toggleLoadingStatus(e.submitter, 'Сохранить');
    });
}

// Open profile edit modal and insert default data into form
function editProfileHandler() {
  editProfileForm.name.value = profileTitle.textContent;
  editProfileForm.description.value = profileDescription.textContent;

  clearValidation(editProfileForm, validationSettings);
  openModal(modalTypeEditProfile);
}

// Handle submit on profile edit
function editProfileSubmitHandler(e) {
  e.preventDefault();
  toggleLoadingStatus(e.submitter, 'Сохранение...');

  const userData = {
    name: editProfileForm.name.value,
    about: editProfileForm.description.value,
  };

  updateUserData(userData)
    .then((userData) => {
      renderProfileInfo(userData);
      closeModal(modalTypeEditProfile);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      toggleLoadingStatus(e.submitter, 'Сохранить');
    });
}

// Display user data
function renderProfileInfo({ avatar, name, about }) {
  profileImage.style.backgroundImage = `url(${avatar})`;
  profileTitle.textContent = name;
  profileDescription.textContent = about;
}

// Handle new card button
function addNewCardHandler() {
  addNewPlaceForm.reset();
  clearValidation(addNewPlaceForm, validationSettings);
  openModal(modalTypeNewCard);
}

// Add new card on new place form submit
function addNewPlaceSubmitHandler(e) {
  e.preventDefault();
  toggleLoadingStatus(e.submitter, 'Создание...');

  const card = {
    name: addNewPlaceForm['place-name'].value,
    link: addNewPlaceForm.link.value,
  };

  postNewCard(card)
    .then((card) => {
      const cardElement = createCard(userId, card, {
        showImage,
        removeCardHandler,
        likeHandler,
      });
      placesListElement.prepend(cardElement);
      closeModal(modalTypeNewCard);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      toggleLoadingStatus(e.submitter, 'Создать');
    });
}

// Open modal to confirm card deletion
function removeCardHandler(cardId, cardElement) {
  cardToDelete.id = cardId;
  cardToDelete.element = cardElement;

  openModal(modalTypeRemoveCard);
}

// Delete card and close modal
function confirmRemoveCard(e) {
  e.preventDefault();

  deleteCard(cardToDelete.id)
    .then(() => {
      removeCard(cardToDelete.element);
      closeModal(modalTypeRemoveCard)
    })
    .catch((err) => console.error(err))
}

// Control like button and counter
// Update like counter through API
function likeHandler(cardId, likeButton, likeCountElement) {
  const liked = likeButton.classList.contains('card__like-button_is-active');

  updateLike(cardId, liked)
    .then(card => {
      toggleLikeButton(!liked, likeButton);
      updateLikeCount(card, likeCountElement);
    })
    .catch(err => console.error(err));
}

// Show card image popup
function showImage(src, alt) {
  openModal(modalTypeImage);

  modalImage.src = src;
  modalImage.alt = alt;
  modalCaption.textContent = alt;
}

// Render cards from the array
function renderCards(cards, listElement) {
  cards.forEach((card) => {
    const cardElement = createCard(userId, card, {
      showImage,
      removeCardHandler,
      likeHandler,
    });
    listElement.append(cardElement);
  });
}

function init() {
  Promise.all([getUserData(), getInitialCards()])
    .then(([userData, cards]) => {
      userId = userData._id;
      renderProfileInfo(userData);
      renderCards(cards, placesListElement);
    })
    .catch((err) => console.error(err));

  enableValidation(validationSettings);

  // Avatar edit button
  profileImage.addEventListener('click', avatarEditHandler);

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);

  // Confirm remove card button
  // confirmRemoveButton.addEventListener('click', confirmRemoveCard);

  // Modal close
  const modals = document.querySelectorAll('.popup');
  modals.forEach((modal) => {
    // Overlay listener
    modal.addEventListener('click', (e) => overlayClickHandler(e, modal));

    // Close button listener
    const closeBtn = modal.querySelector('.popup__close');
    closeBtn.addEventListener('click', () => closeModal(modal));
  });

  // Forms submit
  editAvatarForm.addEventListener('submit', editAvatarSubmitHandler);
  editProfileForm.addEventListener('submit', editProfileSubmitHandler);
  addNewPlaceForm.addEventListener('submit', addNewPlaceSubmitHandler);
  removeCardForm.addEventListener('submit', confirmRemoveCard);
}

init();
