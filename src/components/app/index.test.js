import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // initialized i18next instance
import App from '.';
import Splashscreen from '../splashscreen/splashscreen';
import Login from '../loginV2/loginV2';
import TransactionsDashboard from '../transactionDashboard';
import routes from '../../constants/routes';

const fakeStore = configureStore();

const addRouter = Component => (props, path) =>
  mount(<Provider {...props}>
    <MemoryRouter initialEntries={path}>
      <I18nextProvider i18n={i18n}>
        <Component />
      </I18nextProvider>
    </MemoryRouter>
  </Provider>);

const publicComponent = [
  { route: '/', component: Splashscreen },
  { route: '/login', component: Login },
];

const privateComponent = [
  { route: `${routes.wallet.path}`, component: TransactionsDashboard },
];

describe('App', () => {
  const navigateTo = addRouter(App);
  describe('renders correct routes', () => {
    const store = fakeStore({
      account: {},
      dialog: {},
      peers: { liskAPIClient: { options: {} }, options: {} },
      settings: {
        autoLog: true,
        advancedMode: true,
        areTermsOfUseAccepted: true,
        token: {
          active: 'LSK',
          list: {
            BTC: true,
            LSK: true,
          },
        },
      },
      search: {
        suggestions: {
          delegates: [],
          addresses: [],
          transactions: [],
        },
      },
      network: {
        name: 'mainnet',
      },
    });
    publicComponent.forEach(({ route, component }) => {
      it(`should render ${component.name} component at "${route}" route`, () => {
        const wrapper = navigateTo({ store }, [route]);
        wrapper.find('LoadingBar').props().markAsLoaded();
        wrapper.update();
        expect(wrapper.find(component).exists()).to.be.equal(true);
      });
    });

    privateComponent.forEach(({ route, component }) => {
      it(`should redirect from ${component.name} component if user is not authenticated`, () => {
        const wrapper = navigateTo({ store }, [route]);
        wrapper.find('LoadingBar').props().markAsLoaded();
        wrapper.update();
        expect(wrapper.find(component).exists()).to.be.equal(false);
        expect(wrapper.find(Login).exists()).to.be.equal(true);
      });
    });
  });

  // These tests are skipped because App component use many components and all of them need
  // specific data to render. Each time you will add new components to App, this tests can be fall.
  // Need solution for these kinds of tests.
  describe.skip('allow to render private components after logged in', () => {
    const store = fakeStore({
      account: {
        publicKey: '000',
      },
      dialog: {},
      peers: {
        status: {
          online: true,
        },
        liskAPIClient: {
          options: {
            name: 'Test',
          },
        },
      },
    });
    privateComponent.forEach(({ route, component }) => {
      it(`should reder ${component.name} component at "${route}" route if user is authenticated`, () => {
        const wrapper = navigateTo({ store }, [route]);
        expect(wrapper.find(component).exists()).to.be.equal(true);
      });
    });
  });
});
