import { AutoForm } from 'meteor/aldeed:autoform';
import 'materialize-clockpicker/src/js/materialize.clockpicker.js';
import { moment } from 'meteor/momentjs:moment';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

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

Template.formNewShift.onRendered(function formNewShiftOnRendered() {
  $('.timepicker').pickatime({
    autoclose: true,
    twelvehour: false,
    default: '',
    donetext: 'OK',
  });
  const $input = this.$('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 2,
    format: TAPi18n.__('components.pickadate.format'),
    closeOnSelect: true,
    closeOnClear: true,
    max: new Date(),
    onSet(ele) {
      if (ele.select) {
        this.close();
      }
    },
  });
  const picker = $input.pickadate('picker');
  this.autorun(() => {
    picker.component.settings.monthsFull = _.map(TAPi18n.__('components.pickadate.monthsFull', { returnObjectTrees: true }), month => month);
    picker.component.settings.monthsShort = _.map(TAPi18n.__('components.pickadate.monthsShort', { returnObjectTrees: true }), month => month);
    picker.component.settings.weekdaysFull = _.map(TAPi18n.__('components.pickadate.weekdaysFull', { returnObjectTrees: true }), weekday => weekday);
    picker.component.settings.weekdaysShort = _.map(TAPi18n.__('components.pickadate.weekdaysShort', { returnObjectTrees: true }), weekday => weekday);
    picker.component.settings.today = TAPi18n.__('components.pickadate.today');
    picker.component.settings.clear = TAPi18n.__('components.pickadate.clear');
    picker.component.settings.close = TAPi18n.__('components.pickadate.close');
    picker.component.settings.firstDay = TAPi18n.__('components.pickadate.firstDay');
    picker.component.settings.format = TAPi18n.__('components.pickadate.format');
    picker.component.settings.labelMonthNext = TAPi18n.__('components.pickadate.labelMonthNext');
    picker.component.settings.labelMonthPrev = TAPi18n.__('components.pickadate.labelMonthPrev');
    picker.component.settings.labelMonthSelect = TAPi18n.__('components.pickadate.labelMonthSelect');
    picker.component.settings.labelYearSelect = TAPi18n.__('components.pickadate.labelYearSelect');
    picker.render();
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

AutoForm.addHooks('insertShiftForm', {
  onSuccess() {
    this.template.$('.select-customer').val(SessionAmplify.get('shiftstats-user-favorite-customer'));
    this.template.$('select').material_select();
    this.template.$('.datepicker').val(moment().format(TAPi18n.__('components.pickadate.format').toUpperCase()));
  },
});
