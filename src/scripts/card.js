// Create card function
export function createCard(
  userId,
  card,
  showImageHandler,
  removeHandler,
  likeHandler,
) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate
    .querySelector('.card')
    .cloneNode(true);

  const cardTitle = cardElement.querySelector('.card__title');
  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardElement.dataset.id = card._id;
  cardTitle.textContent = card.name;
  cardImage.src = card.link;
  cardImage.alt = card.name;
  likeCount.textContent = card.likes.length;

  cardImage.addEventListener('click', () =>
    showImageHandler(cardImage.src, cardImage.alt)
  );
  likeButton.addEventListener('click', () =>
    likeHandler(card._id, likeButton, likeCount)
  );

  if (userId === card.owner._id) {
    deleteButton.addEventListener('click', () => removeHandler(card._id));
  } else {
    deleteButton.remove();
  }

  if (card.likes.some((like) => like._id === userId)) {
    toggleLikeButton(true, likeButton);
  }

  return cardElement;
}

export function removeCard(card) {
  card.remove();
}

export function toggleLikeButton(liked, likeButton) {
  if (liked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }
}

export function updateLikeCount(likes, likeCount) {
  likeCount.textContent = likes;
}
