import { openModal } from "./modal.js";
import { modalImage, modalImageImg, modalImageCaption } from "./index.js";

// Create card function
export function createCard(card, clickHandler, removeHandler, likeHandler) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardTitle = cardElement.querySelector('.card__title');
  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  
  cardTitle.textContent = card.name;
  cardImage.src = card.link;
  cardImage.alt = card.name;

  cardImage.addEventListener('click', () => clickHandler(cardImage));
  deleteButton.addEventListener('click', () => removeHandler(cardElement));
  likeButton.addEventListener('click', () => likeHandler(likeButton));

  return cardElement;
}

export function removeCard(card) {
  card.remove();
}

export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

export function showImage(image) {
  openModal(modalImage);

  const src = image.src;
  const alt = image.alt;
  const description = alt;

  modalImageImg.src = src;
  modalImageImg.alt = alt;
  modalImageCaption.textContent = description;
}