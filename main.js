(()=>{"use strict";function e(e,r,n){var o=n.showImage,c=n.removeCardHandler,i=n.likeHandler,a=document.querySelector("#card-template").content.querySelector(".card").cloneNode(!0),u=a.querySelector(".card__title"),l=a.querySelector(".card__image"),s=a.querySelector(".card__delete-button"),d=a.querySelector(".card__like-button"),p=a.querySelector(".card__like-count");return u.textContent=r.name,l.src=r.link,l.alt=r.name,p.textContent=r.likes.length,r.likes.some((function(t){return t._id===e}))&&t(!0,d),l.addEventListener("click",(function(){return o(l.src,l.alt)})),d.addEventListener("click",(function(){var e=d.classList.contains("card__like-button_is-active");i(r._id,e,d,p)})),e===r.owner._id?s.addEventListener("click",(function(){return c(r._id,a)})):s.remove(),a}function t(e,t){e?t.classList.add("card__like-button_is-active"):t.classList.remove("card__like-button_is-active")}function r(e){e.classList.add("popup_is-opened"),document.addEventListener("keydown",o)}function n(e){e.classList.remove("popup_is-opened"),document.removeEventListener("keydown",o)}function o(e){"Escape"===e.key&&n(document.querySelector(".popup_is-opened"))}function c(e,t){var r=e.querySelector(t.submitButtonSelector),n=Array.from(e.querySelectorAll(t.inputSelector));i(n,r,t),n.forEach((function(e){return a(e,t)}))}function i(e,t,r){!function(e){return e.some((function(e){return!e.validity.valid}))}(e)?(t.disabled=!1,t.classList.remove(r.inactiveButtonClass)):(t.disabled=!0,t.classList.add(r.inactiveButtonClass))}function a(e,t){var r=e.closest(t.inputWrapperSelector);e.classList.remove(t.inputErrorClass);var n=r.querySelector(t.errorSelector);n.textContent="",n.classList.remove(t.errorVisibleClass)}function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){d(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t,r){return(t=function(e){var t=function(e){if("object"!=u(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var r=t.call(e,"string");if("object"!=u(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==u(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var p={baseUrl:"https://nomoreparties.co/v1/wff-cohort-32",headers:{authorization:"69375b7f-2c05-445b-b0a3-b2c0034556e4","Content-Type":"application/json"}},f=function(e){return Array.isArray(e)&&e.every((function(e){return e.ok}))?Promise.all(e.map((function(e){return e.json()}))):e.ok?e.json():Promise.reject("Ошибка получения данных")};function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}var y,v=null,b={},_={formSelector:".popup__form",inputSelector:".popup__input",submitButtonSelector:".popup__button",inactiveButtonClass:"popup__button_disabled",inputWrapperSelector:".popup__input-wrapper",inputErrorClass:"popup__input_type_error",errorSelector:".popup__error",errorVisibleClass:"popup__error_visible"},h=document.querySelector(".places__list"),S=document.querySelector(".profile__edit-button"),g=document.querySelector(".profile__add-button"),E=document.querySelector(".profile__image"),k=document.querySelector(".profile__title"),q=document.querySelector(".profile__description"),C=document.querySelector(".popup_type_edit-avatar"),L=document.querySelector(".popup_type_edit"),O=document.querySelector(".popup_type_new-card"),j=document.querySelector(".popup_type_remove-card"),w=document.querySelector(".popup_type_image"),P=w.querySelector(".popup__image"),A=w.querySelector(".popup__caption"),x=document.forms["edit-avatar"],D=document.forms["edit-profile"],U=document.forms["new-place"],T=document.forms["remove-card"];function H(e,t){e.textContent=t}function I(e){var t=e.avatar,r=e.name,n=e.about;E.style.backgroundImage="url(".concat(t,")"),k.textContent=r,q.textContent=n}function B(e,t){b.id=e,b.element=t,r(j)}function V(e,r,n,o){(function(e,t){var r={method:t?"DELETE":"PUT",headers:s({},p.headers)};return fetch("".concat(p.baseUrl,"/cards/likes/").concat(e),r).then(f)})(e,r).then((function(e){t(!r,n),function(e,t){t.textContent=e.likes.length}(e,o)})).catch((function(e){return console.error(e)}))}function M(e,t){r(w),P.src=e,P.alt=t,A.textContent=t}Promise.all([fetch("".concat(p.baseUrl,"/users/me"),{headers:p.headers}).then(f),fetch("".concat(p.baseUrl,"/cards"),{headers:p.headers}).then(f)]).then((function(t){var r,n,o=(n=2,function(e){if(Array.isArray(e))return e}(r=t)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,c,i,a=[],u=!0,l=!1;try{if(c=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=c.call(r)).done)&&(a.push(n.value),a.length!==t);u=!0);}catch(e){l=!0,o=e}finally{try{if(!u&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(l)throw o}}return a}}(r,n)||function(e,t){if(e){if("string"==typeof e)return m(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(e,t):void 0}}(r,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),c=o[0],i=o[1];v=c._id,I(c),function(t,r){t.forEach((function(t){var n=e(v,t,{showImage:M,removeCardHandler:B,likeHandler:V});r.append(n)}))}(i,h)})).catch((function(e){return console.error(e)})),y=_,Array.from(document.querySelectorAll(y.formSelector)).forEach((function(e){!function(e,t){var r=Array.from(e.querySelectorAll(t.inputSelector)),n=e.querySelector(t.submitButtonSelector);r.forEach((function(e){e.addEventListener("input",(function(){!function(e,t){e.validity.patternMismatch?e.setCustomValidity(e.dataset.errorMessage):e.setCustomValidity(""),e.validity.valid?a(e,t):function(e,t,r){var n=e.closest(r.inputWrapperSelector);e.classList.add(r.inputErrorClass);var o=n.querySelector(r.errorSelector);o.textContent=t,o.classList.add(r.errorVisibleClass)}(e,e.validationMessage,t)}(e,t),i(r,n,t)}))}))}(e,y)})),E.addEventListener("click",(function(){x.reset(),c(x,_),r(C)})),S.addEventListener("click",(function(){D.name.value=k.textContent,D.description.value=q.textContent,c(D,_),r(L)})),g.addEventListener("click",(function(){U.reset(),c(U,_),r(O)})),document.querySelectorAll(".popup").forEach((function(e){e.addEventListener("click",(function(t){return function(e,t){e.target===t&&n(t)}(t,e)})),e.querySelector(".popup__close").addEventListener("click",(function(){return n(e)}))})),x.addEventListener("submit",(function(e){var t,r;e.preventDefault(),H(e.submitter,"Сохранение..."),(t=x.link.value,r={method:"PATCH",headers:s({},p.headers),body:JSON.stringify({avatar:t})},fetch("".concat(p.baseUrl,"/users/me/avatar"),r).then(f)).then((function(e){E.style.backgroundImage="url(".concat(e.avatar,")"),n(C)})).catch((function(e){return console.error(e)})).finally((function(){H(e.submitter,"Сохранить")}))})),D.addEventListener("submit",(function(e){var t,r;e.preventDefault(),H(e.submitter,"Сохранение..."),(t={name:D.name.value,about:D.description.value},r={method:"PATCH",headers:s({},p.headers),body:JSON.stringify(t)},fetch("".concat(p.baseUrl,"/users/me"),r).then(f)).then((function(e){I(e),n(L)})).catch((function(e){return console.error(e)})).finally((function(){H(e.submitter,"Сохранить")}))})),U.addEventListener("submit",(function(t){var r,o;t.preventDefault(),H(t.submitter,"Создание..."),(r={name:U["place-name"].value,link:U.link.value},o={method:"POST",headers:s({},p.headers),body:JSON.stringify(r)},fetch("".concat(p.baseUrl,"/cards"),o).then(f)).then((function(t){var r=e(v,t,{showImage:M,removeCardHandler:B,likeHandler:V});h.prepend(r),n(O)})).catch((function(e){return console.error(e)})).finally((function(){H(t.submitter,"Создать")}))})),T.addEventListener("submit",(function(e){var t,r;e.preventDefault(),(t=b.id,r={method:"DELETE",headers:s({},p.headers)},fetch("".concat(p.baseUrl,"/cards/").concat(t),r).then(f)).then((function(){b.element.remove(),n(j)})).catch((function(e){return console.error(e)}))}))})();
//# sourceMappingURL=main.js.map