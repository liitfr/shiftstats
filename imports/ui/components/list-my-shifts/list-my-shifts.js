import { lodash } from 'meteor/alethes:lodash';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Shifts } from '../../../api/shifts/shifts.js';

import '../loader/loader.js';

import './list-my-shifts.html';

// TODO : 1. list doens't update when month change. and page is empty
// TODO : 2. Empty data and debug user counters (after create / delete / update (date update))!
// TODO : 3. Debug date display
// TODO : 4. Delete feature
// TODO : 5. Order in client side

const _ = lodash;

Template.listMyShifts.onCreated(function listMyShiftsOnCreated() {
  this.monthToDisplay = new ReactiveVar();
  this.dataAvailable = new ReactiveVar(false);
});

Template.listMyShifts.helpers({
  monthToDisplay() {
    return Template.instance().monthToDisplay;
  },
  dataAvailable() {
    return Template.instance().dataAvailable;
  },
});

// -----------------------------------------------------------------------------

Template.myMonthsList.onCreated(function myMonthsListOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('users.me', () => {
      template.autorun(() => {
        const me = Meteor.users.findOne();
        if (me.shiftsCounter > 0) {
          template.data.dataAvailable.set(true);
        } else {
          template.data.dataAvailable.set(false);
        }
        const lastMonth = _.max(Object.keys(_.omit(me.months, counter => counter <= 0)));
        // TODO : do not set if there's already a monthToDisplay set & counter > 0
        template.data.monthToDisplay.set(lastMonth === -Infinity ? undefined : lastMonth);
        Tracker.afterFlush(() => {
          template.$('select').material_select();
        });
      });
    });
  });
});

Template.myMonthsList.helpers({
  isSelected(testedMonth) {
    return testedMonth === Template.instance().data.monthToDisplay.get();
  },
  myMonths() {
    return _.map(_.sortBy(Object.keys(_.omit(Meteor.users.findOne().months,
    counter => counter <= 0)), month => -month), month => ({
      value: month,
      label: `${TAPi18n.__(`components.pickadate.monthsFull.${parseInt(month.substring(4, 6), 10) - 1}`)} ${month.substring(0, 4)}`,
    }));
  },
  dataAvailable() {
    return Template.instance().data.dataAvailable.get();
  },
});

Template.myMonthsList.events({
  'change #my-months-list': function changeMyMonthsList(event, templateInstance) {
    templateInstance.data.monthToDisplay.set(event.target.value);
  },
});

// -----------------------------------------------------------------------------

Template.myCustomersInMonth.onCreated(function myCustomersInMonthOnCreated() {
  const template = this;
  template.shiftToModify = new ReactiveVar();
  template.autorun(() => {
    if (template.data.dataAvailable.get && template.data.monthToDisplay.get() !== undefined) {
      template.subscribe('shifts.mine', template.data.monthToDisplay.get());
    }
  });
});

Template.myCustomersInMonth.onRendered(function myCustomersInMonthOnRendered() {
  this.$('.modal').modal();
  // TODO : reinit timepicker when doc changes
  this.$('.timepicker').pickatime({
    autoclose: true,
    twelvehour: false,
    default: '',
    donetext: 'OK',
  });
  const $input = this.$('.datepicker').pickadate({
    container: 'main',
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

Template.myCustomersInMonth.helpers({
  Shifts() {
    return Shifts;
  },
  shifts() {
    return Shifts.find();
  },
  // TODO: use RV everywhere
  shiftToModifyRV() {
    return Template.instance().shiftToModify;
  },
  shiftToModify() {
    return Template.instance().shiftToModify.get();
  },
  buttonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.formNewShift.buttonContent')} <i class="material-icons right">send</i>`);
  },
  dataAvailable() {
    return Template.instance().data.dataAvailable.get();
  },
});

// -----------------------------------------------------------------------------

Template.myShiftsInCustomer.helpers({
  gainsWithCurrency() {
    return `${this.shift.gains} ${this.shift.currency}`;
  },
  distWithKM() {
    return `${this.shift.nbKms} km`;
  },
  durationInHours() {
    const hours = Math.floor(this.shift.duration / 60);
    const minutes = `0${this.shift.duration % 60}`.slice(-2);
    return `${hours}h${minutes}`;
  },
});

// -----------------------------------------------------------------------------

Template.shiftsItem.helpers({
  formatedDate() {
    return moment((this.shift.date).toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase());
  },
  gainsWithCurrency() {
    return `${this.shift.gains} ${this.currency}`;
  },
  distWithKM() {
    return `${this.shift.nbKms} km`;
  },
});

Template.shiftsItem.events({
  'click .modal-trigger': function clickModalTrigger() {
    this.shiftToModify.set(this.shift);
  },
});
