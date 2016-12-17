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
};

const fch = (url, method = 'GET', headers, body) => {
  if (body === undefined) {
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
  return fch(`/api/user/logout`, 'POST', {sid}, null)
    .then(() => sid = undefined)
    .catch(error => {
      if (error.status === 401) {
        // if already not logged in, no problem
        return;
      } else {
        throw error;
      }
    });
};

export const ask = (title, tags, text) => {
  return fch(`/api/ask`, 'POST', {sid}, {title, tags, text})
};

export const getList = (type) => {
  return fch(`/api/list/${type}`);
};

export const getQuestion = (quid) => {
  return fch(`/api/question/${quid}`);
};

// ============================================================================
export const getWatching = () => {
  return fch(`/api/watch/watching`, 'GET', {sid}, null);
};
export const addWatching = (quid) => {
  return fch(`/api/watch/watching/${quid}`, 'PUT', {sid}, null);
};
export const removeWatching = (quid) => {
  return fch(`/api/watch/watching/${quid}`, 'DELETE', {sid}, null);
};

export const getViewing = () => {
  return fch(`/api/watch/viewing`, 'GET', {sid}, null);
};
export const addViewing = (quid) => {
  return fch(`/api/watch/viewing/${quid}`, 'PUT', {sid}, null);
};
export const removeViewing = (quid) => {
  return fch(`/api/watch/viewing/${quid}`, 'DELETE', {sid}, null);
};

export const getHistory = () => {
  return fch(`/api/watch/history`, 'GET', {sid}, null);
};
export const clearHistory = () => {
  return fch(`/api/watch/history`, 'DELETE', {sid}, null);
};
