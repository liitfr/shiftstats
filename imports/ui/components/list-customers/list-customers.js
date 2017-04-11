/* eslint-disable prefer-arrow-callback */
/* global document */

import { Materialize } from 'meteor/materialize:materialize';
import { TAPi18n } from 'meteor/tap:i18n';

import { Customers } from '../../../api/customers/customers.js';

import '../loader/loader.js';
import './list-customers.html';

Template.listCustomers.onCreated(function listCustomersOnCreated() {
  // TODO : as seen in tutorial & blaze doc, we should use SimpleSchema here too
  // LIIT : seems like we don't need autorun ?!
  const template = this;
  template.subscribe('customers.admin', () => {
    Tracker.afterFlush(() => {
      $('select').material_select();
    });
  });
});

// -----------------------------------------------------------------------------

Template.customersList.onCreated(function customersListOnCreated() {
  this.customerToDelete = new ReactiveVar();
});

Template.customersList.onRendered(function () {
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
  customerToDelete() {
    return Template.instance().customerToDelete;
  },
});

Template.customersList.events({
  'click #delete-for-real': function deleteForReal() {
    Customers.remove(Template.instance().customerToDelete.get(), () => {
      Materialize.toast(TAPi18n.__('crudActions.customers.remove'), Meteor.settings.public.toastDuration);
    });
  },
});

// -----------------------------------------------------------------------------

Template.customersItem.onCreated(function customersItemOnCreated() {
  this.displayForm = new ReactiveVar(false);
});

Template.customersItem.helpers({
  Customers() {
    return Customers;
  },
  updateButtonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.listCustomers.updateButtonContent')} <i class="material-icons right">loop</i>`);
  },
  displayForm() {
    return Template.instance().displayForm.get();
  },
  formId() {
    return `updateCustomerForm-${this.customer._id}`;
  },
});

// TODO : Warning modal
Template.customersItem.events({
  'click .btn-delete-customer': function eventDeleteCustomer() {
    this.customerToDelete.set(this.customer._id);
  },
  'click .collapsible-header': function eventShowForm(event, templateInstance) {
    templateInstance.displayForm.set(true);
  },
});
