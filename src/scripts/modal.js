// Show modal
export function openModal(modal) {
  modal.classList.add('popup_is-opened');

  document.addEventListener('keydown', escPressHandler);
}

// Hide modal
export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');

  document.removeEventListener('keydown', escPressHandler);
}

function escPressHandler(e) {
  if (e.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    closeModal(openedModal);
  }
}

export function closeButtonHandler(modal) {
  closeModal(modal);
}

export function overlayClickHandler(e, modal) {
  if (e.target === modal) closeModal(modal);
}
