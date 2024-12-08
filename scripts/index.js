// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesListElement = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(card, removeCardCallback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  
  cardElement.querySelector('.card__title').textContent = card.name;
  cardElement.querySelector('.card__image').src = card.link;
  cardElement.querySelector('.card__image').alt = `Фотография ${card.name}`;

  cardDeleteButton.addEventListener('click', removeCardCallback)

  return cardElement;
}

// @todo: Функция удаления карточки
function removeCard(e) {
  const cardElement = e.target.closest('.card');
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(card => {
  const cardElement = createCard(card, removeCard);
  placesListElement.append(cardElement);
});