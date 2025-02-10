import { checkMime } from './api';

export function enableValidation(selectors) {
  const forms = Array.from(document.querySelectorAll('.' + selectors.form));

  forms.forEach((form) => {
    setEventListeners(form, selectors);
  });
}

// TODO
export function clearValidation(form, selectors) {
  const submitButton = form.querySelector('.' + selectors.submitBtn);
  const inputs = Array.from(form.querySelectorAll('.' + selectors.input));

  toggleSubmitButton(inputs, submitButton, selectors);
  inputs.forEach((input) => hideInputError(input, selectors));
}

function setEventListeners(form, selectors) {
  const inputs = Array.from(form.querySelectorAll('.' + selectors.input));
  const submitButton = form.querySelector('.' + selectors.submitBtn);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(input, selectors);
      toggleSubmitButton(inputs, submitButton, selectors);
    });
  });
}

function isValid(input, selectors) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity('');
  }

  if (!input.validity.valid) {
    showInputError(input, input.validationMessage, selectors);
  } else {
    hideInputError(input, selectors);
  }
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

function toggleSubmitButton(inputs, button, selectors) {
  if (hasInvalidInput(inputs)) {
    button.disabled = true;
    button.classList.add(selectors.disabledBtn);
  } else {
    button.disabled = false;
    button.classList.remove(selectors.disabledBtn);
  }
}

export function showInputError(input, errMessage, selectors) {
  const inputContainer = input.closest('.' + selectors.inputContainer);

  input.classList.add(selectors.inputError);

  const errorElement = inputContainer.querySelector('.' + selectors.error);
  errorElement.textContent = errMessage;
  errorElement.classList.add(selectors.errorVisible);
}

function hideInputError(input, selectors) {
  const inputContainer = input.closest('.' + selectors.inputContainer);

  input.classList.remove(selectors.inputError);

  const errorElement = inputContainer.querySelector('.' + selectors.error);
  errorElement.textContent = '';
  errorElement.classList.remove(selectors.errorVisible);
}
