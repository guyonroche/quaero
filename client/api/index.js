'use strict';

import fetch from 'isomorphic-fetch';

const STD_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// some api requests require a login token
let sid = undefined;

const parseResponse = response => {
  return response.json()
    .then(json => {
      if (response.status >= 400) {
        throw new Error(json.error);
      } else {
        return json;
      }
    }, () => {
      throw new Error('Something went wrong');
    });

  try {
    const json = response.json();
    if (response.status >= 400) {
      throw new Error(json.error);
    } else {
      return json;
    }
  }
  catch(error) {
    throw new Error('Something went wrong');
  }
};

const fch = (url, method, headers, body) => {
  if (arguments.length === 3) {
    body = headers;
    headers = undefined;
  }
  return fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: { ...STD_HEADERS, ...headers }
    })
    .then(parseResponse);
};

export const register = (username, password) => {
  return fch(`/api/user/register`, 'POST', { username, password })
    .then(response => sid = response.sid)
    .then(() => undefined); // hide the sid
};

export const login = (username, password) => {
  return fch(`/api/user/login`, 'POST', { username, password })
    .then(response => sid = response.sid)
    .then(() => undefined); // hide the sid
};

export const logout = () => {
  return fch(`/api/user/logout`, 'POST', {sid}, undefined)
    .then(() => sid = undefined);
};

