'use strict';

import fetch from 'isomorphic-fetch';

const STD_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const parseResponse = response => {
  if (response.status >= 400) {
    throw new Error('Bad Response from server' + response.status);
  } else {
    return response.json();
  }
};

export const register = (username, password) => {
  return fetch(`/api/user/register`, {
      method: 'POST',
      body: { username, password },
      headers: STD_HEADERS
    })
    .then(parseResponse);
};