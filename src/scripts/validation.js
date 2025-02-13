export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));

  forms.forEach((form) => {
    setEventListeners(form, settings);
  });
}

// TODO
export function clearValidation(form, settings) {
  const submitButton = form.querySelector(settings.submitButtonSelector);
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));

  toggleSubmitButton(inputs, submitButton, settings);
  inputs.forEach((input) => hideInputError(input, settings));
}

function setEventListeners(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const submitButton = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(input, settings);
      toggleSubmitButton(inputs, submitButton, settings);
    });
  });
}

function isValid(input, settings) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity('');
  }

  if (!input.validity.valid) {
    showInputError(input, input.validationMessage, settings);
  } else {
    hideInputError(input, settings);
  }
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

function toggleSubmitButton(inputs, button, settings) {
  if (hasInvalidInput(inputs)) {
    button.disabled = true;
    button.classList.add(settings.inactiveButtonClass);
  } else {
    button.disabled = false;
    button.classList.remove(settings.inactiveButtonClass);
  }
}

export function showInputError(input, errMessage, settings) {
  const inputContainer = input.closest(settings.inputWrapperSelector);

  input.classList.add(settings.inputErrorClass);

  const errorElement = inputContainer.querySelector(settings.errorSelector);
  errorElement.textContent = errMessage;
  errorElement.classList.add(settings.errorVisibleClass);
}

function hideInputError(input, settings) {
  const inputContainer = input.closest(settings.inputWrapperSelector);

  input.classList.remove(settings.inputErrorClass);

  const errorElement = inputContainer.querySelector(settings.errorSelector);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorVisibleClass);
}