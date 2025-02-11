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
import {
  clearValidation,
  enableValidation,
  showInputError,
} from './validation.js';
import {
  handleResponse,
  getInitialCards,
  getUserData,
  updateUserData,
  postNewCard,
  deleteCard,
  updateLike,
  updateAvatarUrl,
  checkMime,
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
// States:
// true - loading
// false - initial
function toggleLoadingStatus(state, button) {
  if (state === true) {
    button.textContent = 'Сохранить...';
  } else {
    button.textContent = 'Сохранить';
  }
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

  // toggleLoadingStatus(true, e.submitter);
  updateAvatar(editAvatarForm);
}

function updateAvatar(form) {
  checkMime(form.link.value, 'image')
    .then(() => updateAvatarUrl(form.link.value))
    .then(handleResponse)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(modalTypeEditAvatar);
    })
    .catch((err) => {
      // toggleLoadingStatus(e.submitter);
      showInputError(form.link, err);
    });
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

  // toggleLoadingStatus(true, e.submitter);

  updateProfile(editProfileForm, profileTitle, profileDescription);
}

// Display user data
function renderProfileInfo({ avatar, name, about }) {
  profileImage.style.backgroundImage = `url(${avatar})`;
  profileTitle.textContent = name;
  profileDescription.textContent = about;
}

// Update profile info on submit
function updateProfile(form) {
  const userData = {
    name: form.name.value,
    about: form.description.value,
  };

  updateUserData(userData)
    .then(handleResponse)
    .then((data) => {
      renderProfileInfo(data);
      // toggleLoadingStatus(e.submitter);
      closeModal(modalTypeEditProfile);
    })
    .catch((err) => console.error(err));
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

  // toggleLoadingStatus(true, e.submitter);
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
    .then((card) => {
      const callbacks = [showImage, removeCardHandler, likeHandler];
      const cardElement = createCard(userId, card, ...callbacks);

      listElement.prepend(cardElement);
      // toggleLoadingStatus(e.submitter);
      closeModal(modalTypeNewCard);
    })
    .catch((err) => console.error(err));
}

// Open modal to confirm card deletion
function removeCardHandler(cardId) {
  openModal(modalTypeRemoveCard);
  modalTypeRemoveCard.dataset.cardId = cardId;
}

// Delete card and close modal
function confirmRemoveCard() {
  const cardId = modalTypeRemoveCard.dataset.cardId;

  deleteCard(cardId)
    .then(handleResponse)
    .then(() => {
      const card = placesListElement.querySelector(`[data-id='${cardId}']`);
      modalTypeRemoveCard.dataset.cardId = '';

      removeCard(card);
      closeModal(modalTypeRemoveCard);
    })
    .catch((err) => console.error(err));
}

// Control like button and counter
// Update like counter through API
function likeHandler(cardId, likeButton, likeCount) {
  getInitialCards()
    .then(handleResponse)
    .then((cards) => {
      const card = cards.find((card) => card._id === cardId);
      const liked = card.likes.some((like) => like._id === userId);

      updateLike(cardId, liked)
        .then(handleResponse)
        .then((card) => {
          toggleLikeButton(!liked, likeButton);
          updateLikeCount(card.likes.length, likeCount);
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
    const callbacks = [showImage, removeCardHandler, likeHandler];
    const cardElement = createCard(userId, card, ...callbacks);
    listElement.append(cardElement);
  });
}

function init() {
  Promise.all([getUserData(), getInitialCards()])
    .then(([userDataRes, cardsRes]) => {
      if (userDataRes.ok && cardsRes.ok)
        return Promise.all([userDataRes.json(), cardsRes.json()]);
      return Promise.reject('Запрос к серверу завершился с ошибкой.');
    })
    .then(([userData, cards]) => {
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
  const modals = [
    modalTypeEditAvatar,
    modalTypeEditProfile,
    modalTypeImage,
    modalTypeNewCard,
    modalTypeRemoveCard,
  ];
  modals.forEach((modal) => {
    // Overlay listener
    modal.addEventListener('click', (e) =>
      overlayClickHandler(e, modal)
    );

    // Close button listener
    const closeBtn = modal.querySelector('.popup__close');
    closeBtn.addEventListener('click', () =>
      closeButtonHandler(modal)
    );
  });

  // Forms submit
  editAvatarForm.addEventListener('submit', editAvatarSubmitHandler);
  editProfileForm.addEventListener('submit', editProfileSubmitHandler);
  addNewPlaceForm.addEventListener('submit', addNewPlaceSubmitHandler);
}

init();
