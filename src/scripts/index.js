import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, removeCard, likeCard } from './card.js';
import { openModal, closeModal, closeButtonHandler, overlayClickHandler } from './modal.js';

// Selectors to pass into functions in external modules
const modalSelectors = {
  modal: 'popup',
  visible: 'popup_is-opened',
  hidden: 'popup_is-animated',
  close: 'popup__close',
};

const cardSelectors = {
  template: 'card-template',
  card: 'card',
  title: 'card__title',
  image: 'card__image',
  likeBtn: 'card__like-button',
  deleteBtn: 'card__delete-button',
  likeBtnActive: 'card__like-button_is-active',
};

// DOM
// General
const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');

// Profile info
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Modals
const modalTypeEdit = document.querySelector('.popup_type_edit');
const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeImage = document.querySelector('.popup_type_image');

// Forms
const editProfileForm = document.forms['edit-profile'];
const addNewPlaceForm = document.forms['new-place'];

// Open profile edit modal and insert default data into form
function editProfileHandler() {
  editProfileForm.name.value = profileTitle.textContent;
  editProfileForm.description.value = profileDescription.textContent;

  openModal(modalTypeEdit, modalSelectors);
}

// Handle submit on profile edit
function editProfileSubmitHandler(e) {
  e.preventDefault();

  updateProfile(editProfileForm, profileTitle, profileDescription);
  closeModal(modalTypeEdit, modalSelectors);
};

// Update profile info on submit
function updateProfile(form, titleElement, descriptionElement) {
  titleElement.textContent = form.name.value;
  descriptionElement.textContent = form.description.value;
}

// Handle new card button
function addNewCardHandler() {
  addNewPlaceForm.reset();
  openModal(modalTypeNewCard, modalSelectors);
}

// Add new card on new place form submit
function addNewPlaceSubmitHandler(e) {
  e.preventDefault();

  addNewCard(addNewPlaceForm, placesListElement);
  closeModal(modalTypeNewCard, modalSelectors);
};

// Add new card to the list
function addNewCard(form, listElement) {
  const card = {
    name: form['place-name'].value,
    link: form.link.value,
  };

  const callbacks = [showImage, removeCard, likeCard];
  const cardElement = createCard(card, ...callbacks, cardSelectors);
  listElement.prepend(cardElement);
}

// Handle click on card image
function showImageHandler(e) {
  if (e.target.classList.contains('card__image')) {
    const image = e.target;
    showImage(image);
  }
}

// Show card image popup
function showImage(image) {
  openModal(modalTypeImage, modalSelectors);

  const src = image.src;
  const alt = image.alt;
  const description = alt;

  const modalImage = modalTypeImage.querySelector('.popup__image');
  const modalCaption = modalTypeImage.querySelector('.popup__caption');

  modalImage.src = src;
  modalImage.alt = alt;
  modalCaption.textContent = description;
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
  renderCards(initialCards, placesListElement);

  // Image click
  placesListElement.addEventListener('click', showImageHandler);

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);

  // Modal close
  [modalTypeEdit, modalTypeImage, modalTypeNewCard].forEach(modal => {
    // Overlay listener
    modal.addEventListener('click', e => overlayClickHandler(e, modal, modalSelectors));

    // Close button listener
    const closeBtn = modal.querySelector('.' + modalSelectors.close);
    closeBtn.addEventListener('click', () => closeButtonHandler(modal, modalSelectors));
  })

  // Forms submit
  editProfileForm.addEventListener('submit', editProfileSubmitHandler);
  addNewPlaceForm.addEventListener('submit', addNewPlaceSubmitHandler);
}

init();
