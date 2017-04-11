/* global amplify */

// HACK : Had to define amplify as global since I didn't find what package to include ...

import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Shifts } from '../../../api/shifts/shifts.js';

import './form-new-shift.html';

// TODO : error message in FR !
// TODO : save customer choice
// TODO : default date : date of the day

Template.formNewShift.onCreated(function formNewShiftOnCreated() {
  // TODO : as seen in tutorial & blaze doc, we should use SimpleSchema here too
  this.subscribe('customers.list', function () {
    Tracker.afterFlush(function () {
      // LIIT : generate dropdowns only when data is available
      this.$('select').material_select();
    });
  });
});

Template.formNewShift.onRendered(() => {
  $('select').material_select();
  $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 2,
    format: 'dd/mm/yyyy',
    closeOnSelect: true,
    closeOnClear: true,
    max: new Date(),
    onSet(ele) {
      if (ele.select) {
        this.close();
      }
    },
  });
});

Template.formNewShift.onDestroyed(() => {
  $('select').material_select('destroy');
});

Template.formNewShift.helpers({
  Shifts() {
    return Shifts;
  },
  buttonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.formNewShift.buttonContent')} <i class="material-icons right">send</i>`);
  },
});

Template.formNewShift.events({
  'change .select-customer': function changeSelectCustomer(event) {
    // amplify.store('autoform-favorite-customer', $(event.target).val());
  },
});
