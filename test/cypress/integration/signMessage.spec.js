// import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import { withRouter } from 'react-router';
// import { getActiveTokenAccount } from '../../../src/utils/account';
import React from 'react';
import SignMessage from '../../../src/components/signMessage';
import accounts from '../../constants/accounts';


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
    cy.mountWithContext(<SignMessage />, { account });
    cy.get('h1').contains('Sign a message');
    cy.get('textarea').type(message); // TODO put a className on the textarea and use it here
    cy.get('button').eq(0).click(); // TODO put a className on the button and use it here
    cy.get('h1').contains('Your signed message');
    cy.get('textarea').contains(signedMessage); // TODO put a className on the textarea and use it here
  });
});
