import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, showImage, removeCard, likeCard } from './card.js';
import { openModal, closeModal, closeModalHandler, escPressHandler } from './modal.js';

// Class names
export const visibleModalClass = 'popup_is-opened';
export const hiddenModalClass = 'popup_is-animated';

// DOM
const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const modalEdit = document.querySelector('.popup_type_edit');
const modalNewCard = document.querySelector('.popup_type_new-card');
export const modalImage = document.querySelector('.popup_type_image');

export const modalImageImg = document.querySelector('.popup__image');
export const modalImageCaption = document.querySelector('.popup__caption');

// const modalOverlays = document.querySelectorAll('.popup');
// const modalCloseButtons = document.querySelectorAll('.popup__close');

const forms = document.forms;
const editProfileForm = forms['edit-profile'];
const addNewPlaceForm = forms['new-place'];

function submitHandler(e) {
  e.preventDefault();
  console.log(e);
  const form = e.target;
  const modal = form.closest('.popup');
  
  submitForm(form);
  closeModal(modal);
  form.reset();
}

function submitForm(form) {
  const formName = form.getAttribute('name');

  if (formName === 'edit-profile') updateProfile(editProfileForm, profileTitle, profileDescription);
  if (formName === 'new-place') addNewCard(addNewPlaceForm, initialCards, placesListElement);
}

// Open profile edit modal and insert default data
function editProfileHandler() {
  editProfileForm.name.value = profileTitle.textContent;
  editProfileForm.description.value = profileDescription.textContent;

  openModal(modalEdit);

  document.addEventListener('keydown', escPressHandler);
}

// Update profile info on submit
function updateProfile(form, titleElement, descriptionElement) {
  titleElement.textContent = form.name.value;
  descriptionElement.textContent = form.description.value;
}

function addNewCardHandler() {
  addNewPlaceForm.reset();
  openModal(modalNewCard);

  document.addEventListener('keydown', escPressHandler);
}

function addNewCard(form, arr, listElement) {
  const card = {
    name: form['place-name'].value,
    link: form.link.value,
  };

  arr.unshift(card);
  
  clearPlacesList(listElement);
  renderCards(arr, listElement);
}

// Clear cards list
function clearPlacesList(listElement) {
  listElement.innerHTML = '';
}

// Render cards from the array
function renderCards(cards, listElement) {
  cards.forEach(card => {
    const cardElement = createCard(card, showImage, removeCard, likeCard);
    listElement.append(cardElement);
  })
};

function init() {
  renderCards(initialCards, placesListElement);

  // Event Listeners
  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);
  
  // Close modal on overlay or X click
  const closeTargets = ['popup', 'popup__close'];
  document.addEventListener('click', (e) => closeModalHandler(e, ...closeTargets));
  
  // Form submit
  document.addEventListener('submit', submitHandler);
}

init();

