import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Customers } from '../../../api/customers/customers.js';

import './form-new-customer.html';

Template.formNewCustomer.onCreated(function formNewCustomerOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('countries.list', () => {
      Tracker.afterFlush(() => {
        template.$('select[name$="country"]').material_select();
      });
    });
    template.subscribe('cities.listBigCities', () => {
      Tracker.afterFlush(() => {
        template.$('select[name$="city"]').material_select();
      });
    });
    template.subscribe('timezones.list', () => {
      Tracker.afterFlush(() => {
        template.$('select[name$="timezone"]').material_select();
      });
    });
    template.subscribe('currencies.list');
  });
});

Template.formNewCustomer.onDestroyed(function formNewCustomerOnDestroyed() {
  const template = this;
  template.$('select').material_select('destroy');
});

Template.formNewCustomer.helpers({
  Customers() {
    return Customers;
  },
  buttonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.formNewCustomer.buttonContent')} <i class="material-icons right">send</i>`);
  },
});
