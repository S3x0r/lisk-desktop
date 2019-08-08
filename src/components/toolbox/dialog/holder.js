import React from 'react';
import styles from './dialog.css';

class DialogHolder extends React.Component {
  constructor() {
    super();
    this.state = {
      dialog: null,
      dismissed: false,
    };

    DialogHolder.singletonRef = this;
    DialogHolder.hideDialog = DialogHolder.hideDialog.bind(DialogHolder);
    DialogHolder.showDialog = DialogHolder.showDialog.bind(DialogHolder);
  }

  static hideDialog() {
    this.singletonRef.setState({ dismissed: true });
    setTimeout(() => {
      this.singletonRef.setState({ dialog: null });
      document.body.style.overflow = '';
    }, 150);
  }

  static showDialog(dialog) {
    if (React.isValidElement(dialog)) {
      const setDialog = () => this.singletonRef.setState({
        dismissed: false,
        dialog,
      });

      document.body.style.overflow = 'hidden';
      this.singletonRef.setState({
        dismissed: true,
        dialog: null,
      }, setDialog);
      return true;
    }
    return false;
  }

  render() {
    const { dismissed } = this.state;
    const ChildComponent = this.state.dialog;
    return React.isValidElement(ChildComponent) && (
      <div className={`${styles.mask} ${dismissed ? styles.hide : styles.show}`}>
        <ChildComponent.type
          {...ChildComponent.props}
        />
      </div>
    );
  }
}

DialogHolder.displayName = 'DialogHolder';

export default DialogHolder;
