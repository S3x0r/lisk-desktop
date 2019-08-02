/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import Lisk from '@liskhq/lisk-client';
import { getActiveTokenAccount } from '../../utils/account';
import { secondPassphraseRegistered } from '../../actions/account';
import SecondPassphrase from './secondPassphrase';
import withSignAndBroadcast from '../../utils/withSignAndBroadcast';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

const mapDispatchToProps = {
  secondPassphraseRegistered,
};

export default compose(
  withRouter,
  withSignAndBroadcast({ signUtil: Lisk.transaction.registerSecondPassphrase }),
  connect(mapStateToProps, mapDispatchToProps),
  translate(),
)(SecondPassphrase);
