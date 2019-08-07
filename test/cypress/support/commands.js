// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// import settings from '../../constants/settings';

import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { deepMergeObj } from '../../../src/utils/helpers';
import networks from '../../constants/networks';
import { accountLoggedIn } from '../../../src/actions/account';
import { loginType } from '../../../src/constants/hwConstants';
import { networkSet } from '../../../src/actions/network';
import i18n from '../../../src/i18n';
import store from '../../../src/store';

before(() => {
  // Check if lisk core is running
  cy.request(`${networks.devnet.node}/api/node/constants`).then(resp => expect(resp.status).to.eq(200));
});

// beforeEach(() => {
//   const btcSettings = deepMergeObj(
//     settings,
//     { token: { list: { BTC: true } } },
//   );
//   window.localStorage.setItem('settings', JSON.stringify(btcSettings));
// });

Cypress.Commands.add('addToLocalStorage', (item, value) => {
  window.localStorage.setItem(item, value);
});

Cypress.Commands.add('mergeObjectWithLocalStorage', (item, data) => {
  const localStorageData = JSON.parse(window.localStorage.getItem(item)) || {};
  const newData = JSON.stringify(deepMergeObj(localStorageData, data));
  window.localStorage.setItem(item, newData);
});

Cypress.Commands.add('addObjectToLocalStorage', (item, key, value) => {
  const itemString = window.localStorage.getItem(item);
  const itemObject = itemString ? JSON.parse(itemString) : {};
  itemObject[key] = value;
  window.localStorage.setItem(item, JSON.stringify(itemObject));
});

Cypress.Commands.add('autologin', (passphrase, network) => {
  localStorage.setItem('liskCoreUrl', network);
  localStorage.setItem('loginKey', passphrase);
});

Cypress.Commands.add('mountWithContext', (component, { account }) => {
  store.dispatch(networkSet({
    name: networks.testnet.name,
  }));
  if (account) {
    store.dispatch(accountLoggedIn({
      passphrase: account.passphrase,
      loginType: loginType.normal,
      hwInfo: {},
      info: {
        LSK: account,
        [undefined]: account,
      },
    }));
  }
  cy.mount(
    <Provider store={store}>
      <Router>
        <I18nextProvider i18n={i18n}>
          {component}
        </I18nextProvider>
      </Router>
    </Provider>,
  );
});
