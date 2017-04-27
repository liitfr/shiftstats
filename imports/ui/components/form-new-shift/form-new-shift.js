import { AutoForm } from 'meteor/aldeed:autoform';
import 'materialize-clockpicker/src/js/materialize.clockpicker.js';
import { moment } from 'meteor/momentjs:moment';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Shifts } from '../../../api/shifts/shifts.js';

import './form-new-shift.html';

Template.formNewShift.onCreated(function formNewShiftOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('customers.list', () => {
      Tracker.afterFlush(() => {
        template.$('select').material_select();
      });
    });
  });
});

// TODO : bug after submit, if you open date picker,
// displayed dates in input & calendar aren't the same
Template.formNewShift.onRendered(function formNewShiftOnRendered() {
  this.$('.timepicker').pickatime({
    autoclose: true,
    twelvehour: false,
    default: '',
    donetext: 'OK',
  });
});

Template.formNewShift.onDestroyed(function formNewShiftOnDestroyed() {
  this.$('select').material_select('destroy');
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
    SessionAmplify.set('shiftstats-user-favorite-customer', $(event.target).val());
  },
});

// -----------------------------------------------------------------------------

AutoForm.addHooks('insertShiftForm', {
  onSuccess() {
    this.template.$('.select-customer').val(SessionAmplify.get('shiftstats-user-favorite-customer'));
    this.template.$('select').material_select();
    this.template.$('.datepicker').val(moment().format(TAPi18n.__('components.pickadate.format').toUpperCase()));
  },
});
