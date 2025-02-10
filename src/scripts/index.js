import '../pages/index.css';
import { modalSelectors, cardSelectors, validationSelectors } from './selectors.js';
import { createCard, removeCard, toggleLikeButton, updateLikeCount } from './card.js';
import {
  openModal,
  closeModal,
  closeButtonHandler,
  overlayClickHandler,
} from './modal.js';
import { clearValidation, enableValidation, showInputError } from './validation.js';
import { 
  handleResponse,
  getInitialCards, 
  getUserData, 
  updateUserData, 
  postNewCard, 
  deleteCard, 
  updateLike,
  updateAvatarUrl,
  checkMime
} from './api.js';

let userId;

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
function toggleLoadingStatus(button) {
  if (button.textContent === 'Сохранить...') {
    button.textContent = 'Сохранить';
  } else {
    button.textContent = 'Сохранить...'; 
  }
}

// Open avatar edit modal
function avatarEditHandler() {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationSelectors);
  openModal(modalTypeEditAvatar, modalSelectors);
}

// Submit avatar update form
function editAvatarSubmitHandler(e) {
  e.preventDefault();

  const submitButton = modalTypeEditAvatar.querySelector('.' + modalSelectors.btn);

  toggleLoadingStatus(submitButton);
  updateAvatar(editAvatarForm);
}

function updateAvatar(form) {
  const submitButton = modalTypeEditAvatar.querySelector('.' + modalSelectors.btn);

  checkMime(form.link.value, 'image')
    .then(() => updateAvatarUrl(form.link.value))
    .then(handleResponse)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`
      closeModal(modalTypeEditAvatar, modalSelectors);
    })
    .catch(err => {
      toggleLoadingStatus(submitButton);
      showInputError(form.link, err, validationSelectors);
    })
}

// Open profile edit modal and insert default data into form
function editProfileHandler() {
  editProfileForm.name.value = profileTitle.textContent;
  editProfileForm.description.value = profileDescription.textContent;

  clearValidation(editProfileForm, validationSelectors);
  openModal(modalTypeEditProfile, modalSelectors);
}

// Handle submit on profile edit
function editProfileSubmitHandler(e) {
  e.preventDefault();

  const submitButton = modalTypeEditProfile.querySelector('.' + modalSelectors.btn);
  toggleLoadingStatus(submitButton);

  updateProfile(editProfileForm, profileTitle, profileDescription);
}

// Display user data
function renderProfileInfo({ avatar, name, about }) {
  profileImage.style.backgroundImage = `url(${avatar})`
  profileTitle.textContent = name;
  profileDescription.textContent = about;
}

// Update profile info on submit
function updateProfile(form) {
  const userData = {
    name: form.name.value,
    about: form.description.value,
  }

  updateUserData(userData)
    .then(handleResponse)
    .then(data => {
      const submitButton = modalTypeEditProfile.querySelector('.' + modalSelectors.btn);

      renderProfileInfo(data);
      toggleLoadingStatus(submitButton);
      closeModal(modalTypeEditProfile, modalSelectors);
    })
    .catch(err => console.error(err));
}

// Handle new card button
function addNewCardHandler() {
  addNewPlaceForm.reset();
  clearValidation(addNewPlaceForm, validationSelectors);
  openModal(modalTypeNewCard, modalSelectors);
}

// Add new card on new place form submit
function addNewPlaceSubmitHandler(e) {
  e.preventDefault();

  const submitButton = modalTypeNewCard.querySelector('.' + modalSelectors.btn)

  toggleLoadingStatus(submitButton);
  addNewCard(addNewPlaceForm, placesListElement);
}

// Add new card to the list
function addNewCard(form, listElement) {
  const card = {
    name: form['place-name'].value,
    link: form.link.value,
  };

  postNewCard(card)
    .then(handleResponse)
    .then(card => {
      const callbacks = [showImage, removeCardHandler, likeHandler];
      const cardElement = createCard(userId, card, ...callbacks, cardSelectors);
      const submitButton = modalTypeNewCard.querySelector('.' + modalSelectors.btn);

      listElement.prepend(cardElement);
      toggleLoadingStatus(submitButton);
      closeModal(modalTypeNewCard, modalSelectors);
    })
    .catch(err => console.error(err));

}

// Open modal to confirm card deletion
function removeCardHandler(cardId) {
  openModal(modalTypeRemoveCard, modalSelectors);
  modalTypeRemoveCard.dataset.cardId = cardId;
}

// Delete card and close modal
function confirmRemoveCard() {
  const cardId = modalTypeRemoveCard.dataset.cardId;

  deleteCard(cardId)
    .then(handleResponse)
    .then(()=> {
      const card = placesListElement.querySelector(`[data-id='${cardId}']`);
      modalTypeRemoveCard.dataset.cardId = '';

      closeModal(modalTypeRemoveCard, modalSelectors);
      removeCard(card);
    })
    .catch(err => console.error(err));
}

// Control like button and counter
// Update like counter through API
function likeHandler(cardId, likeButton, likeCount) {
  getInitialCards()
    .then(handleResponse)
    .then(cards => {
      const card = cards.find(card => card._id === cardId);
      const liked = card.likes.some(like => like._id === userId);
      
      updateLike(cardId, liked)
      .then(handleResponse)
      .then(card => {
          toggleLikeButton(!liked, likeButton, cardSelectors);
          updateLikeCount(card.likes.length, likeCount);
      });
    })
    .catch(err => console.error(err));
}

// Show card image popup
function showImage(src, alt) {
  openModal(modalTypeImage, modalSelectors);

  modalImage.src = src;
  modalImage.alt = alt;
  modalCaption.textContent = alt;
}

// Render cards from the array
function renderCards(cards, listElement) {
  cards.forEach((card) => {
    const callbacks = [showImage, removeCardHandler, likeHandler];
    const cardElement = createCard(userId, card, ...callbacks, cardSelectors);
    listElement.append(cardElement);
  });
}

function init() {
  Promise.all([getUserData(), getInitialCards()])
    .then(([userDataRes, cardsRes]) => {
      if (userDataRes.ok && cardsRes.ok) return Promise.all([userDataRes.json(), cardsRes.json()]);
      return Promise.reject('Запрос к серверу завершился с ошибкой.');
    })
    .then(([userData, cards]) => {
      userId = userData._id;
      renderProfileInfo(userData);
      renderCards(cards, placesListElement);
    })
    .catch(err => console.error(err));

  enableValidation(validationSelectors);

  // Avatar edit button
  profileImage.addEventListener('click', avatarEditHandler);

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);

  // Confirm remove card button
  confirmRemoveButton.addEventListener('click', confirmRemoveCard);

  // Modal close
  const modals = [
    modalTypeEditAvatar,
    modalTypeEditProfile, 
    modalTypeImage, 
    modalTypeNewCard, 
    modalTypeRemoveCard
  ];
  modals.forEach((modal) => {
    // Overlay listener
    modal.addEventListener('click', (e) =>
      overlayClickHandler(e, modal, modalSelectors)
    );

    // Close button listener
    const closeBtn = modal.querySelector('.' + modalSelectors.close);
    closeBtn.addEventListener('click', () =>
      closeButtonHandler(modal, modalSelectors)
    );
  });

  // Forms submit
  editAvatarForm.addEventListener('submit', editAvatarSubmitHandler);
  editProfileForm.addEventListener('submit', editProfileSubmitHandler);
  addNewPlaceForm.addEventListener('submit', addNewPlaceSubmitHandler);
}

init();