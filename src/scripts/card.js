// Create card function
export function createCard(
  card,
  showImageHandler,
  removeHandler,
  likeHandler,
  selectors
) {
  const cardTemplate = document.querySelector('#' + selectors.template).content;
  const cardElement = cardTemplate
    .querySelector('.' + selectors.card)
    .cloneNode(true);

  const cardTitle = cardElement.querySelector('.' + selectors.title);
  const cardImage = cardElement.querySelector('.' + selectors.image);
  const deleteButton = cardElement.querySelector('.' + selectors.deleteBtn);
  const likeButton = cardElement.querySelector('.' + selectors.likeBtn);

  cardTitle.textContent = card.name;
  cardImage.src = card.link;
  cardImage.alt = card.name;

  cardImage.addEventListener('click', () =>
    showImageHandler(cardImage.src, cardImage.alt)
  );
  deleteButton.addEventListener('click', () => removeHandler(cardElement));
  likeButton.addEventListener('click', () =>
    likeHandler(likeButton, selectors)
  );

  return cardElement;
}

export function removeCard(card) {
  card.remove();
}

export function likeCard(likeButton, selectors) {
  likeButton.classList.toggle(selectors.likeBtnActive);
}
