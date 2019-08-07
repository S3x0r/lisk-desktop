import { Route } from 'react-router-dom';
import React from 'react';
import SingleTransaction from '../../../src/components/singleTransaction';
import routes from '../../../src/constants/routes';

const transactionId = '15050547001985124057';
const route = `/explorer/transactions/${transactionId}`;
const mockResponse = {
  meta: { offset: 0, limit: 10, count: 1 },
  data: [{
    id: '15050547001985124057',
    height: 9,
    blockId: '8073928406734587107',
    type: 0,
    timestamp: 90173996,
    senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    recipientPublicKey: '',
    senderId: '16313739661670634666L',
    recipientId: '16422276087748907680L',
    amount: '7000000000',
    fee: '10000000',
    signature: '2d80ddb6b5cde8c789b38f77c82abb2cb2572e7d56fd7590bf757eb4610bdb5e102717d4c8eecc2285c0cee8f14987512ceff7788fe4ae7bc98d3852644a0102',
    signatures: [],
    asset: { data: 'send-all-account' },
    confirmations: 15902,
  }],
  links: {},
};
const path = routes.transactions.path + routes.transactions.pathSuffix;

describe('SingleTransaction', () => {
  it('should show the given transaction', () => {
    cy.server();
    cy.route(`https://testnet.lisk.io/api/transactions?id=${transactionId}`, mockResponse);
    cy.mountWithContext(
      <Route path={path} component={SingleTransaction} />,
      { route },
    );
    cy.get('h1').contains('Transaction details');
    cy.get('.sender-address').contains(mockResponse.data[0].senderId);
    cy.get('.receiver-address').contains(mockResponse.data[0].recipientId);
    cy.get('.tx-confirmation').contains(mockResponse.data[0].confirmations);
    cy.get('.transaction-id').contains(transactionId);
    cy.get('.tx-reference').contains(mockResponse.data[0].asset.data);
  });
});
