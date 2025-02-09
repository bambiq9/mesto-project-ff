import '../pages/index.css';
import { modalSelectors, cardSelectors, validationSelectors } from './selectors.js';
import { createCard, removeCard, toggleLikeButton, updateLikeCount } from './card.js';
import {
  openModal,
  closeModal,
  closeButtonHandler,
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
  handleResponse,
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
const modalTypeEdit = document.querySelector('.popup_type_edit');
const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeRemoveCard = document.querySelector('.popup_type_remove-card');
const modalTypeImage = document.querySelector('.popup_type_image');
const modalImage = modalTypeImage.querySelector('.popup__image');
const modalCaption = modalTypeImage.querySelector('.popup__caption');
const confirmRemoveButton = modalTypeRemoveCard.querySelector('.popup__button');

// Forms
const editProfileForm = document.forms['edit-profile'];
const addNewPlaceForm = document.forms['new-place'];

// Open profile edit modal and insert default data into form
function editProfileHandler() {
  editProfileForm.name.value = profileTitle.textContent;
  editProfileForm.description.value = profileDescription.textContent;

  clearValidation(editProfileForm, validationSelectors);
  openModal(modalTypeEdit, modalSelectors);
}

// Handle submit on profile edit
function editProfileSubmitHandler(e) {
  e.preventDefault();

  updateProfile(editProfileForm, profileTitle, profileDescription);
  closeModal(modalTypeEdit, modalSelectors);
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
    .then(data => renderProfileInfo(data))
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

  addNewCard(addNewPlaceForm, placesListElement);
  closeModal(modalTypeNewCard, modalSelectors);
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
      listElement.prepend(cardElement);
    })
    .catch(err => console.error(err));

}

function removeCardHandler(cardId) {
  openModal(modalTypeRemoveCard, modalSelectors);
  modalTypeRemoveCard.dataset.cardId = cardId;
}

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

function likeHandler(cardId, likeButton, likeCount) {
  getInitialCards()
    .then(handleResponse)
    .then(cards => {
      const card = cards.find(card => card._id === cardId);
      const liked = card.likes.some(like => like._id === userId);
      toggleLikeButton(!liked, likeButton, cardSelectors);

      updateLike(cardId, liked)
        .then(handleResponse)
        .then(card => {
          updateLikeCount(card.likes.length, likeCount);
        })
        .catch(err => console.err(err));
    })
    .catch(err => console.err(err));
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

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);

  // Confirm remove card button
  confirmRemoveButton.addEventListener('click', confirmRemoveCard);

  // Modal close
  const modals = [modalTypeEdit, modalTypeImage, modalTypeNewCard, modalTypeRemoveCard];
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
  editProfileForm.addEventListener('submit', editProfileSubmitHandler);
  addNewPlaceForm.addEventListener('submit', addNewPlaceSubmitHandler);
}

init();