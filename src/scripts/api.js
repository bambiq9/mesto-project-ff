const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-32',
  headers: {
    authorization: '69375b7f-2c05-445b-b0a3-b2c0034556e4',
    'Content-Type': 'application/json'
  }
}

export const getUserData = () => fetch(`${config.baseUrl}/users/me`, { headers: config.headers });

export const getInitialCards = () => fetch(`${config.baseUrl}/cards`, { headers: config.headers });

export const updateUserData = (userData) => {
  const options = { 
    method: 'PATCH',
    headers: {
      ...config.headers,
    },
    body: JSON.stringify(userData),
  }

  return fetch(`${config.baseUrl}/users/me`, options);
}

export const postNewCard = (cardData) => {
  const options = { 
    method: 'POST',
    headers: {
      ...config.headers,
    },
    body: JSON.stringify(cardData),
  }

  return fetch(`${config.baseUrl}/cards`, options);
}