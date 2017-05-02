/* global Materialize */

import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import { Customers } from '../../../api/customers/customers.js';

import '../loader/loader.js';
import './list-customers.html';

// TODO : performances are really, really bad ...

Template.listCustomers.onCreated(function listCustomersOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('customers.admin');
  });
});

// -----------------------------------------------------------------------------

Template.customersList.onCreated(function customersListOnCreated() {
  this.customerToDeleteRV = new ReactiveVar();
});

Template.customersList.onRendered(function customersListOnRendered() {
  this.$('.collapsible').collapsible();
  this.$('.modal').modal();
});

Template.customersList.helpers({
  customers() {
    return Customers.find({}, {
      sort: {
        label: 1,
      },
    });
  },
  customerToDeleteRV() {
    return Template.instance().customerToDeleteRV;
  },
});

Template.customersList.events({
  'click #delete-for-real': function clickDeleteForReal() {
    Customers.remove(Template.instance().customerToDeleteRV.get(), (err) => {
      Materialize.toast(err || TAPi18n.__('crudActions.customers.remove'), Meteor.settings.public.toastDuration);
    });
  },
});

// -----------------------------------------------------------------------------

Template.customersItem.onCreated(function customersItemOnCreated() {
  this.displayFormRV = new ReactiveVar(false);
});

Template.customersItem.helpers({
  Customers() {
    return Customers;
  },
  updateButtonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.listCustomers.updateButtonContent')} <i class="material-icons right">loop</i>`);
  },
  displayForm() {
    return Template.instance().displayFormRV.get();
  },
  formId() {
    return `updateCustomerForm-${this.customer._id}`;
  },
});

Template.customersItem.events({
  'click .btn-delete-customer': function clickBtnDeleteCustomer() {
    this.customerToDeleteRV.set(this.customer._id);
  },
  'click .collapsible-header': function clickCollapsibleHeader(event, templateInstance) {
    templateInstance.displayFormRV.set(true);
  },
});
