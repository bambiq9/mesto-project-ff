const animationDelay = 600;

// Show modal
export function openModal(modal, selectors) {
  const { visible, hidden } = selectors;

  modal.classList.add(hidden);

  setTimeout(() => {
    modal.classList.add(visible);
  });

  // document.addEventListener('keydown', escHandler);
};

// Hide modal
export function closeModal(modal, selectors) {
  const { visible, hidden } = selectors;
  
  modal.classList.remove(visible);

  setTimeout(() => {
    modal.classList.remove(hidden);
  }, animationDelay);

  // document.removeEventListener('keydown', escHandler);
};

export function escPressHandler(e, modal, selectors) {
  console.log(e);
  if (e.key === 'Escape') {
    closeModal(modal, selectors);
  };
};

// Close modal if clicked on a close target
export function closeModalHandler(e, selectors, closeTargets) {
  const targetClasses = Array.from(e.target.classList);
  
  // Check if the target has a class included in the list of close targets
  if (targetClasses.some(className => closeTargets.includes(className))) {
    const currentModal = document.querySelector('.' + selectors.visible);
    closeModal(currentModal, selectors);
  };
};