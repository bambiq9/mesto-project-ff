// Create card function
export function createCard(
  userId,
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
  const likeCount = cardElement.querySelector('.' + selectors.likeCount);

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
    toggleLikeButton(true, likeButton, selectors);
  }

  return cardElement;
}

export function removeCard(card) {
  card.remove();
}

export function toggleLikeButton(liked, likeButton, selectors) {
  if (liked) {
    likeButton.classList.add(selectors.likeBtnActive);
  } else {
    likeButton.classList.remove(selectors.likeBtnActive);
  }
}

export function updateLikeCount(likes, likeCount) {
  likeCount.textContent = likes;
}
