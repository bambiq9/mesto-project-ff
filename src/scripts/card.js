// Create card function
export function createCard(card) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  cardElement.querySelector('.card__title').textContent = card.name;
  cardElement.querySelector('.card__image').src = card.link;
  cardElement.querySelector('.card__image').alt = `Фотография ${card.name}`;

  return cardElement;
}

// Remove card function
export function removeCard(card) {
  card.remove();
}

export function likeCard() {
  
}