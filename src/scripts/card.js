// Create card function
export function createCard(
  userId,
  card,
  { showImage, removeCardHandler, likeHandler }
) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardTitle = cardElement.querySelector('.card__title');
  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardTitle.textContent = card.name;
  cardImage.src = card.link;
  cardImage.alt = card.name;
  likeCount.textContent = card.likes.length;
  const liked = card.likes.some(user => user._id === userId);

  if (liked) {
    toggleLikeButton(true, likeButton);
  }

  cardImage.addEventListener('click', () =>
    showImage(cardImage.src, cardImage.alt)
  );

  likeButton.addEventListener('click', () => {
    const likeActive = likeButton.classList.contains('card__like-button_is-active');
    likeHandler(card._id, likeActive, likeButton, likeCount);
  });

  if (userId === card.owner._id) {
    deleteButton.addEventListener('click', () =>
      removeCardHandler(card._id, cardElement)
    );
  } else {
    deleteButton.remove();
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

export function updateLikeCount(card, likeCountElement) {
  likeCountElement.textContent = card.likes.length;
}
