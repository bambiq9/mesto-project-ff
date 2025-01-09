// Delay for transition on modal open and close
const animationDelay = 600;

// Escape press handler reference
// Used as reference for removeEventListener
// Allows args in callback and remains removable
let escHandlerReference;

// Show modal
export function openModal(modal, selectors) {
  const { visible, hidden } = selectors;

  modal.classList.add(hidden);

  setTimeout(() => {
    modal.classList.add(visible);
  });

  if (!escHandlerReference) {
    escHandlerReference = escPressHandler(modal, selectors);
    document.addEventListener('keydown', escHandlerReference);
  }
}

// Hide modal
export function closeModal(modal, selectors) {
  const { visible, hidden } = selectors;

  modal.classList.remove(visible);

  if (escHandlerReference) {
    document.removeEventListener('keydown', escHandlerReference);
    escHandlerReference = null;
  }

  setTimeout(() => {
    modal.classList.remove(hidden);
  }, animationDelay);
}

function escPressHandler(modal, selectors) {
  return (e) => {
    if (e.key === 'Escape') closeModal(modal, selectors);
  };
}

// Close modal if clicked on a close target
export function closeModalHandler(e, selectors, closeTargets) {
  const targetClasses = Array.from(e.target.classList);

  // Check if the target has a class included in the list of close targets
  if (targetClasses.some((className) => closeTargets.includes(className))) {
    const currentModal = document.querySelector('.' + selectors.visible);
    closeModal(currentModal, selectors);
  }
}
