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
  closeButtonHandler,
  overlayClickHandler,
} from './modal.js';
import { clearValidation, enableValidation } from './validation.js';
import {
  handleResponse,
  getInitialCards,
  getUserData,
  updateUserData,
  postNewCard,
  deleteCard,
  updateLike,
  updateAvatarUrl,
} from './api.js';

let userId = null;
let removeCardId = null;
const cardsCache = new Map();

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
const confirmRemoveButton = modalTypeRemoveCard.querySelector('.popup__button');

// Forms
const editAvatarForm = document.forms['edit-avatar'];
const editProfileForm = document.forms['edit-profile'];
const addNewPlaceForm = document.forms['new-place'];

// Show remote data update status on submit button
function toggleLoadingStatus(button, text) {
  button.textContent = text;
}

// Open avatar edit modal
function avatarEditHandler() {
  editAvatarForm.reset();
  clearValidation(editAvatarForm);
  openModal(modalTypeEditAvatar);
}

// Submit avatar update form
function editAvatarSubmitHandler(e) {
  e.preventDefault();
  toggleLoadingStatus(e.submitter, 'Сохранение...');

  updateAvatarUrl(editAvatarForm.link.value)
    .then(handleResponse)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(modalTypeEditAvatar);
    })
    .catch((err) => console.error(err))
    .finally(() => toggleLoadingStatus(e.submitter, 'Сохранить'));
}

// Open profile edit modal and insert default data into form
function editProfileHandler() {
  editProfileForm.name.value = profileTitle.textContent;
  editProfileForm.description.value = profileDescription.textContent;

  clearValidation(editProfileForm);
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
    .then(handleResponse)
    .then((userData) => {
      renderProfileInfo(userData);
      closeModal(modalTypeEditProfile);
    })
    .catch((err) => console.error(err))
    .finally(() => toggleLoadingStatus(e.submitter, 'Сохранить'));
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
  clearValidation(addNewPlaceForm);
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
    .then(handleResponse)
    .then((card) => {
      const cardElement = createCard(userId, card, false, {
        showImage,
        removeCardHandler,
        likeHandler,
      });
      cardsCache.set(card._id, { element: cardElement, like: false });
      placesListElement.prepend(cardElement);
      closeModal(modalTypeNewCard);
    })
    .catch((err) => console.error(err))
    .finally(() => toggleLoadingStatus(e.submitter, 'Создать'));
}

// Open modal to confirm card deletion
function removeCardHandler(cardId) {
  removeCardId = cardId;
  openModal(modalTypeRemoveCard);
}

// Delete card and close modal
function confirmRemoveCard() {
  deleteCard(removeCardId)
    .then(handleResponse)
    .then(() => {
      const card = cardsCache.get(removeCardId).element;
      cardsCache.delete(removeCardId);
      removeCardId = null;
      removeCard(card);
    })
    .catch((err) => console.error(err))
    .finally(() => closeModal(modalTypeRemoveCard));
}

// Control like button and counter
// Update like counter through API
function likeHandler(cardId, likeButton, likeCount) {
  const cardCached = cardsCache.get(cardId);

  updateLike(cardId, cardCached.like)
    .then(handleResponse)
    .then((card) => {
      toggleLikeButton(!cardCached.like, likeButton);
      updateLikeCount(card.likes.length, likeCount);
      cardsCache.set(cardId, {
        ...cardsCache.get(cardId),
        like: !cardCached.like,
      });
    })
    .catch((err) => console.error(err));
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
    const liked = card.likes.some((like) => like._id === userId);
    const cardElement = createCard(userId, card, liked, {
      showImage,
      removeCardHandler,
      likeHandler,
    });
    cardsCache.set(card._id, { element: cardElement, like: liked });
    listElement.append(cardElement);
  });
}

function init() {
  Promise.all([getUserData(), getInitialCards()])
    .then(handleResponse)
    .then(([userData, cards]) => {
      console.log(userData);
      userId = userData._id;
      renderProfileInfo(userData);
      renderCards(cards, placesListElement);
    })
    .catch((err) => console.error(err));

  enableValidation();

  // Avatar edit button
  profileImage.addEventListener('click', avatarEditHandler);

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);

  // Confirm remove card button
  confirmRemoveButton.addEventListener('click', confirmRemoveCard);

  // Modal close
  const modals = document.querySelectorAll('.popup');
  modals.forEach((modal) => {
    // Overlay listener
    modal.addEventListener('click', (e) => overlayClickHandler(e, modal));

    // Close button listener
    const closeBtn = modal.querySelector('.popup__close');
    closeBtn.addEventListener('click', () => closeButtonHandler(modal));
  });

  // Forms submit
  editAvatarForm.addEventListener('submit', editAvatarSubmitHandler);
  editProfileForm.addEventListener('submit', editProfileSubmitHandler);
  addNewPlaceForm.addEventListener('submit', addNewPlaceSubmitHandler);
}

init();
