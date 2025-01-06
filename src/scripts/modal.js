// Show modal
export function openModal(modal) {
  modal.classList.add('popup_is-animated');

  setTimeout(() => {
    modal.classList.add('popup_is-opened');
  });
};

// Hide modal
export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');

  setTimeout(() => {
    modal.classList.remove('popup_is-animated');
  }, 1000);
};

export function escPressHandler(e) {
  if (e.key === 'Escape') {
    const modal = document.querySelector('.popup_is-opened');
    closeModal(modal);

    document.removeEventListener('keydown', escPressHandler);
  };
};

export function overlayClickHandler(e) {
  if (e.target.classList.contains('popup')) {
    const modal = document.querySelector('.popup_is-opened');
    closeModal(modal);
  }
};

export function closeButtonHandler(e) {
  if (e.target.classList.contains('popup__close')) {
    const modal = document.querySelector('.popup_is-opened');
    closeModal(modal);
  }
}