import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, removeCard } from './card.js';
import { openModal, escPressHandler, overlayClickHandler, closeButtonHandler } from './modal.js';

// DOM узлы
const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');

const modalEdit = document.querySelector('.popup_type_edit');
const modalNewCard = document.querySelector('.popup_type_new-card');
const modalImage = document.querySelector('.popup_type_image');

const modalOverlays = document.querySelectorAll('.popup');
const modalCloseButtons = document.querySelectorAll('.popup__close');
const forms = document.forms;

// Open profile edit modal
// Handle 
function editProfile() {
  openModal(modalEdit);

  document.addEventListener('keydown', escPressHandler);
}

function addCard() {
  openModal(modalNewCard);
};

function submitForm(e) {
  e.preventDefault();
}

// Image click handler
function imageClickHandler(e) {
  if (e.target.classList.contains('card__image')) {
    openModal(modalImage);
  }
}

// Render cards from the array
function renderCards(cards, listElement) {
  cards.forEach(card => {
    const cardElement = createCard(card);
    listElement.append(cardElement);
  })
};

// Handle click on card delete button
function removeCardHandler(e) {
  if (e.target.classList.contains('card__delete-button')) {
    const card = e.target.closest('.card');
    if (card) removeCard(card);
  }
}

function init() {
  renderCards(initialCards, placesListElement);

  // Event Listeners
  // Profile edit button
  profileEditButton.addEventListener('click', editProfile);

  // Add card button
  newCardButton.addEventListener('click', addCard);

  // Image click
  placesListElement.addEventListener('click', imageClickHandler);

  // Remove card button 
  placesListElement.addEventListener('click', removeCardHandler);
  
  // Modal overlay click
  modalOverlays.forEach(overlay => overlay.addEventListener('click', overlayClickHandler));
  
  // Modal X click
  modalCloseButtons.forEach(button => button.addEventListener('click', closeButtonHandler));
  
  // Form submit
  Array.from(forms).forEach(form => form.addEventListener('submit', submitForm));
}

init();

