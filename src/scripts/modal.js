import { visibleModalClass as visibleClass, hiddenModalClass as hiddenClass } from "./index.js";

const animationDelay = 600;

function getCurrentModal() {
  return document.querySelector('.' + visibleClass);
};

// Show modal
export function openModal(modal) {
  modal.classList.add(hiddenClass);

  setTimeout(() => {
    modal.classList.add(visibleClass);
  });
};

// Hide modal
export function closeModal(modal) {
  modal.classList.remove(visibleClass);

  setTimeout(() => {
    modal.classList.remove(hiddenClass);
  }, animationDelay);
};

export function escPressHandler(e) {
  if (e.key === 'Escape') {
    closeModal(getCurrentModal());

    document.removeEventListener('keydown', escPressHandler);
  };
};

// Close modal if clicked on a close target
export function closeModalHandler(e, ...closeTargets) {
  const targetClasses = Array.from(e.target.classList);
  
  // Check if the target has a class included in the list of close targets
  if (targetClasses.some(className => closeTargets.includes(className))) {
    closeModal(getCurrentModal());
  };
}

// export function overlayClickHandler(e) {
//   if (e.target.classList.contains('popup')) {
//     closeModal(getCurrentModal());
//   }
// };

// export function closeButtonHandler(e) {
//   if (e.target.classList.contains('popup__close')) {
//     closeModal(getCurrentModal());
//   }
// }