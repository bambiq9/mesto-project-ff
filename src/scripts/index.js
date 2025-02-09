import '../pages/index.css';
import { modalSelectors, cardSelectors, validationSelectors } from './selectors.js';
import { createCard, removeCard, likeCard } from './card.js';
import {
  openModal,
  closeModal,
  closeButtonHandler,
  overlayClickHandler,
} from './modal.js';
import { clearValidation, enableValidation } from './validation.js';
import { getInitialCards, getUserData, updateUserData, postNewCard } from './api.js';

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
const modalTypeImage = document.querySelector('.popup_type_image');
const modalImage = modalTypeImage.querySelector('.popup__image');
const modalCaption = modalTypeImage.querySelector('.popup__caption');

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
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(res.status);
    })
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
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(res.status);
    })
    .then(data => {
      const callbacks = [showImage, removeCard, likeCard];
      const cardElement = createCard(data, ...callbacks, cardSelectors);
      listElement.prepend(cardElement);
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
    const callbacks = [showImage, removeCard, likeCard];
    const cardElement = createCard(card, ...callbacks, cardSelectors);
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
      renderProfileInfo(userData);
      renderCards(cards, placesListElement);
    })
    .catch(err => console.error(err));

  enableValidation(validationSelectors);

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);

  // Modal close
  const modals = [modalTypeEdit, modalTypeImage, modalTypeNewCard];
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