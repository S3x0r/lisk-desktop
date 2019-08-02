import { connect } from 'react-redux';
import { to } from 'await-to-js';
import React from 'react';
import { addPendingTransaction } from '../actions/transactions';
import { getTimeOffset } from './hacks';
import { passphraseUsed } from '../actions/account';
import { broadcast } from './api/transactions';

function withSignAndBroadcast({ signUtil }) {
  return function (ChildComponent) {
    class SignAndBroadcastProvider extends React.Component {
      constructor() {
        super();
        this.state = {
          error: '',
          isLoading: false,
        };

        this.signTransaction = this.signTransaction.bind(this);
        this.broadcast = this.broadcast.bind(this);
        this.signAndBroadcast = this.signAndBroadcast.bind(this);
      }

      async signAndBroadcast(params) {
        const transaction = await this.signTransaction(params);
        await this.broadcast(transaction);
      }

      // eslint-disable-next-line consistent-return
      async signTransaction(params) {
        const { blocks, account: { passphrase } } = this.props;
        const timeOffset = getTimeOffset({ blocks });
        this.setState({ isLoading: true, error: '' });
        const [error, transaction] = await to(signUtil({ ...params, passphrase, timeOffset }));
        if (!error) {
          this.setState({ isLoading: false, error });
        } else {
          this.setState({ isLoading: false, transaction });
          return transaction;
        }
      }

      async broadcast(transaction) {
        const { activeToken, network } = this.props;
        transaction = transaction || this.state.transaction;
        const [error] = await to(broadcast(activeToken, transaction, network));
        if (error) {
          this.setState({ isLoading: false, error });
        } else {
          this.setState({ isLoading: false, success: true });
          this.props.addPendingTransaction(transaction);
          this.props.passphraseUsed();
        }
      }

      render() {
        const { ownProps } = this.props;
        return (
          <ChildComponent {...{
            ...ownProps,
            transactionUtil: {
              ...this.state,
              broadcast: this.broadcast,
              signTransaction: this.signTransaction,
              signAndBroadcast: this.signAndBroadcast,
            },
          }}
          />
        );
      }
    }

    function getDisplayName(child) {
      return (child && (child.displayName || child.name)) || 'Component';
    }

    SignAndBroadcastProvider.displayName = `SignAndBroadcastProvider(${getDisplayName(ChildComponent)})`;

    const mapStateToProps = (state, ownProps) => ({
      network: state.network,
      activeToken: state.settings.token.active,
      blocks: state.blocks,
      account: state.account,
      ownProps,
    });

    const mapDispatchToProps = {
      addPendingTransaction,
      passphraseUsed,
    };

    return connect(
      mapStateToProps, mapDispatchToProps,
    )(SignAndBroadcastProvider);
  };
}

export default withSignAndBroadcast;
