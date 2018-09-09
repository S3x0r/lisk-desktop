import React from 'react';
import AccountVisual from '../accountVisual/index';
import Input from '../toolbox/inputs/input';
import keyCodes from './../../constants/keyCodes';

import styles from './bookmark.css';

class Bookmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      selectedIdx: -1,
      resultsLength: 0,
      placeholder: '',
    };
  }

  getFilteredFollowedAccounts() {
    const { followedAccounts, address } = this.props;

    return followedAccounts
      .filter(account => account.title &&
        account.title.toLowerCase().includes(address.value.toLowerCase()));
  }

  handleArrowDown() {
    let currentIdx = this.state.selectedIdx;
    const filteredFollowedAccounts = this.getFilteredFollowedAccounts();
    const searchListLength = filteredFollowedAccounts.length;
    if (searchListLength !== 0 && currentIdx !== searchListLength - 1) {
      currentIdx += 1;
    }

    this.setState({ selectedIdx: currentIdx });
  }

  handleArrowUp() {
    let currentIdx = this.state.selectedIdx;
    const filteredFollowedAccounts = this.getFilteredFollowedAccounts();
    const searchListLength = filteredFollowedAccounts.length;

    if (searchListLength !== 0 && currentIdx !== -1 && currentIdx !== 0) {
      currentIdx -= 1;
    }
    this.setState({ selectedIdx: currentIdx });
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.arrowDown:
        this.handleArrowDown();
        event.preventDefault();
        break;
      case keyCodes.arrowUp:
        this.handleArrowUp();
        event.preventDefault();
        break;
      case keyCodes.enter:
      case keyCodes.tab: // eslint-disable-line
        if (this.props.followedAccounts[this.state.selectedIdx]) {
          const address = this.props.followedAccounts[this.state.selectedIdx].address;
          this.props.handleChange(address);
        }

        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  handleRemove() {
    this.setState({ showFollowedList: false });
  }

  render() {
    const {
      followedAccounts, handleChange, className, label, address,
    } = this.props;

    const filteredFollowedAccounts = this.getFilteredFollowedAccounts();
    const isValidAccount = Number.isInteger(Number(address.value.substring(0, address.value.length - 1))) && address.value[address.value.length - 1] === 'L';

    const isAddressFollowedAccounts = followedAccounts
      .find(account => account.address === address.value);

    const showBigVisualAccountStyles = isValidAccount &&
      !this.state.show &&
      !isAddressFollowedAccounts &&
      !address.error && address.value;

    const showSmallVisualAccountStyles = !(!isValidAccount && address.error && address.value);

    return (
      <div className={this.state.show ? styles.scale : ''}>
        <div className={this.state.show ? styles.bookmark : ''}>
          {isValidAccount && !this.state.show && !!isAddressFollowedAccounts ? <AccountVisual
            className={styles.smallAccountVisual}
            address={address.value}
            size={25}
          /> : null}

          {isValidAccount && !this.state.show && !isAddressFollowedAccounts ? <AccountVisual
            className={styles.bigAccountVisual}
            address={address.value}
            size={50}
          /> : null}
          <Input
            type='text'
            id='bookmark-input'
            className={`${className}
              ${showSmallVisualAccountStyles ? `${styles.bookmarkInput} bookmarkInput` : ''}
              ${showBigVisualAccountStyles ? `${styles.bigAccountVisualBookmarkInput} bigAccountVisualBookmarkInput` : ''}`}
            label={label}
            error={!this.state.show ? address.error : ''}
            autocomplete={false}
            value={address.value}
            innerRef={(el) => { this.inputRef = el; }}
            onFocus={() => this.setState({ show: true })}
            onBlur={() => this.setState({ show: false, selectedIdx: -1 })}
            onKeyDown={this.handleKey.bind(this)}
            onChange={(val) => { handleChange(val); }}
            >
          </Input>
          { this.state.show ?
            <ul className={`${filteredFollowedAccounts.length > 0 ? styles.resultList : ''}
              ${this.state.show ? styles.show : ''}
              bookmarkList`}>
              {
                filteredFollowedAccounts
                  .map((account, index) => (
                    <li
                      onMouseDown={() => {
                        handleChange(account.address);
                      }}
                      key={`followed-${index}`}
                      className={`${styles.followedRow} ${index === this.state.selectedIdx ? styles.selectedRow : ''}`}>
                      <AccountVisual
                        className={styles.accountVisual}
                        address={account.address}
                        size={35}
                      />
                      <div className={styles.text}>
                        <div className={styles.title}>{account.title}</div>
                        <div className={styles.address}>{account.address}</div>
                      </div>
                    </li>))
              }
            </ul> : null }
        </div>
      </div>
    );
  }
}

export default Bookmark;
