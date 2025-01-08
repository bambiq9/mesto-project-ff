import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, removeCard, likeCard } from './card.js';
import { openModal, closeModal, closeModalHandler } from './modal.js';

const modalSelectors = {
  modal: 'popup',
  visible: 'popup_is-opened',
  hidden: 'popup_is-animated',
}

const cardSelectors = {
  template: 'card-template',
  card: 'card',
  title: 'card__title',
  image: 'card__image',
  likeBtn: 'card__like-button',
  deleteBtn: 'card__delete-button',
  likeBtnActive: 'card__like-button_is-active',
}

// DOM
const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const modalEdit = document.querySelector('.popup_type_edit');
const modalNewCard = document.querySelector('.popup_type_new-card');
const modalImage = document.querySelector('.popup_type_image');

const forms = document.forms;
const editProfileForm = forms['edit-profile'];
const addNewPlaceForm = forms['new-place'];

function submitHandler(e) {
  e.preventDefault();
  
  const form = e.target;
  const modal = form.closest('.popup');
  
  submitForm(form);
  closeModal(modal, modalSelectors);
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

  openModal(modalEdit, modalSelectors);
}

// Update profile info on submit
function updateProfile(form, titleElement, descriptionElement) {
  titleElement.textContent = form.name.value;
  descriptionElement.textContent = form.description.value;
}

function addNewCardHandler() {
  addNewPlaceForm.reset();
  openModal(modalNewCard, modalSelectors);
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

function showImage(image) {
  openModal(modalImage, modalSelectors);

  const src = image.src;
  const alt = image.alt;
  const description = alt;

  const modalImageImg = modalImage.querySelector('.popup__image');
  const modalImageCaption = modalImage.querySelector('.popup__caption');

  modalImageImg.src = src;
  modalImageImg.alt = alt;
  modalImageCaption.textContent = description;
}

function showImageHandler(e) {
  if (e.target.classList.contains('card__image')) {
    const image = e.target;
    showImage(image);
  }
}

// Render cards from the array
function renderCards(cards, listElement) {
  cards.forEach(card => {
    const callbacks = [showImage, removeCard, likeCard];
    const cardElement = createCard(card, ...callbacks, cardSelectors);
    listElement.append(cardElement);
  })
};

function init() {
  renderCards(initialCards, placesListElement);

  // Image click
  placesListElement.addEventListener('click', showImageHandler)

  // Profile edit button
  profileEditButton.addEventListener('click', editProfileHandler);

  // Add card button
  newCardButton.addEventListener('click', addNewCardHandler);
  
  // Close modal on overlay or X click
  const closeTargets = ['popup', 'popup__close'];
  document.addEventListener('click', (e) => closeModalHandler(e, modalSelectors, closeTargets));
  
  // Form submit
  document.addEventListener('submit', submitHandler);
}

init();

