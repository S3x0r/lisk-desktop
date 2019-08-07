// import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import { withRouter } from 'react-router';
// import { getActiveTokenAccount } from '../../../src/utils/account';
import React from 'react';
import SignMessage from '../../../src/components/signMessage';

describe('SignMessage', () => {
  cy.mount(<SignMessage />);
  cy.contains('Sign Message');
});
