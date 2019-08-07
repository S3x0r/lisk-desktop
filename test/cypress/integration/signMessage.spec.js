// import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import { withRouter } from 'react-router';
// import { getActiveTokenAccount } from '../../../src/utils/account';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import React from 'react';
import { accountLoggedIn } from '../../../src/actions/account';
import { loginType } from '../../../src/constants/hwConstants';
import { networkSet } from '../../../src/actions/network';
import SignMessage from '../../../src/components/signMessage';
import accounts from '../../constants/accounts';
import i18n from '../../../src/i18n';
import networks from '../../../src/constants/networks';
import store from '../../../src/store';


// TODO move this to some shared place (e.g. test/cypress/support/commands.js)
const mountWithAccount = (component, account) => {
  store.dispatch(networkSet({
    name: networks.testnet.name,
  }));
  store.dispatch(accountLoggedIn({
    passphrase: account.passphrase,
    loginType: loginType.normal,
    hwInfo: {},
    info: {
      LSK: account,
      [undefined]: account,
    },
  }));
  return (
    <Provider store={store}>
      <Router>
        <I18nextProvider i18n={i18n}>
          {component}
        </I18nextProvider>
      </Router>
    </Provider>
  );
};
const account = accounts.genesis;
const message = 'hello';
const signedMessage = `-----BEGIN LISK SIGNED MESSAGE-----
-----MESSAGE-----
${message}
-----PUBLIC KEY-----
${account.publicKey}
-----SIGNATURE-----
ed4a762ee2102b376a24222dfde3fe6b33e2cd9816dd45ab824b64fadd63e225fd80642b6d07aa6ceea3419096411f8d9759be46126de8f296812dcedc66f807
-----END LISK SIGNED MESSAGE-----`;

describe('SignMessage', () => {
  it('should sign the given message', () => {
    cy.mount(mountWithAccount(<SignMessage />, account));
    cy.get('h1').contains('Sign a message');
    cy.get('textarea').type(message); // TODO put a className on the textarea and use it here
    cy.get('button').eq(0).click(); // TODO put a className on the button and use it here
    cy.get('h1').contains('Your signed message');
    cy.get('textarea').contains(signedMessage); // TODO put a className on the textarea and use it here
  });
});
