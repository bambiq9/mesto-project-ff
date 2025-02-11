export function enableValidation() {
  const forms = Array.from(document.querySelectorAll('.popup__form'));

  forms.forEach((form) => {
    setEventListeners(form);
  });
}

// TODO
export function clearValidation(form) {
  const submitButton = form.querySelector('.popup__button');
  const inputs = Array.from(form.querySelectorAll('.popup__input'));

  toggleSubmitButton(inputs, submitButton);
  inputs.forEach((input) => hideInputError(input));
}

function setEventListeners(form) {
  const inputs = Array.from(form.querySelectorAll('.popup__input'));
  const submitButton = form.querySelector('.popup__button');

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(input);
      toggleSubmitButton(inputs, submitButton);
    });
  });
}

function isValid(input) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity('');
  }

  if (!input.validity.valid) {
    showInputError(input, input.validationMessage);
  } else {
    hideInputError(input);
  }
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

function toggleSubmitButton(inputs, button) {
  if (hasInvalidInput(inputs)) {
    button.disabled = true;
    button.classList.add('.popup__button_disabled');
  } else {
    button.disabled = false;
    button.classList.remove('.popup__button_disabled');
  }
}

export function showInputError(input, errMessage) {
  const inputContainer = input.closest('.popup__input-wrapper');

  input.classList.add('popup__input_type_error');

  const errorElement = inputContainer.querySelector('.popup__error');
  errorElement.textContent = errMessage;
  errorElement.classList.add('popup__error_visible');
}

function hideInputError(input) {
  const inputContainer = input.closest('.popup__input-wrapper');

  input.classList.remove('popup__input_type_error');

  const errorElement = inputContainer.querySelector('.popup__error');
  errorElement.textContent = '';
  errorElement.classList.remove('popup__error_visible');
}
