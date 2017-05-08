/* global Materialize */

import { AutoForm } from 'meteor/aldeed:autoform';
import { lodash } from 'meteor/alethes:lodash';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Shifts } from '../../../api/shifts/shifts.js';

import '../loader/loader.js';

import './list-my-shifts.html';

// TODO : loader for both substricptions !
// TODO : sort in client side

const ShiftsMine = new Meteor.Collection('shiftsMine');
const _ = lodash;

Template.listMyShifts.onCreated(function listMyShiftsOnCreated() {
  this.monthToDisplayRV = new ReactiveVar();
  this.dataAvailableRV = new ReactiveVar(false);
});

Template.listMyShifts.helpers({
  monthToDisplayRV() {
    return Template.instance().monthToDisplayRV;
  },
  dataAvailableRV() {
    return Template.instance().dataAvailableRV;
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
          template.data.dataAvailableRV.set(true);
        } else {
          template.data.dataAvailableRV.set(false);
        }
        const lastMonth = _.max(Object.keys(_.omit(me.months, counter => counter <= 0)));
        // TODO : move to last month only if there's no more data in current month !
        template.data.monthToDisplayRV.set(lastMonth === -Infinity ? undefined : lastMonth);
        Tracker.afterFlush(() => {
          template.$('select').material_select();
        });
      });
    });
  });
});

Template.myMonthsList.onDestroyed(function myMonthsListOnDestroyed() {
  this.$('select').material_select('destroy');
});

Template.myMonthsList.helpers({
  isSelected(testedMonth) {
    return testedMonth === Template.instance().data.monthToDisplayRV.get();
  },
  myMonths() {
    return _.map(_.sortBy(Object.keys(_.omit(Meteor.users.findOne().months,
    counter => counter <= 0)), month => -month), month => ({
      value: month,
      label: `${TAPi18n.__(`components.pickadate.monthsFull.${parseInt(month.substring(4, 6), 10) - 1}`)} ${month.substring(0, 4)}`,
    }));
  },
  dataAvailable() {
    return Template.instance().data.dataAvailableRV.get();
  },
});

Template.myMonthsList.events({
  'change #my-months-list': function changeMyMonthsList(event, templateInstance) {
    templateInstance.data.monthToDisplayRV.set(event.target.value);
  },
});

// -----------------------------------------------------------------------------

Template.myCustomersInMonth.onCreated(function myCustomersInMonthOnCreated() {
  const template = this;
  template.shiftToModifyRV = new ReactiveVar();
  template.shiftToDeleteRV = new ReactiveVar();
  template.autorun(() => {
    if (template.data.dataAvailableRV.get() && template.data.monthToDisplayRV.get() !== undefined) {
      template.subscribe('shifts.mine', template.data.monthToDisplayRV.get());
    }
  });
});

Template.myCustomersInMonth.onRendered(function myCustomersInMonthOnRendered() {
  this.$('.modal').modal();
});

Template.myCustomersInMonth.helpers({
  Shifts() {
    return Shifts;
  },
  shifts() {
    return ShiftsMine.find({}, {});
  },
  shiftToModifyRV() {
    return Template.instance().shiftToModifyRV;
  },
  shiftToModify() {
    return Template.instance().shiftToModifyRV.get();
  },
  shiftToDeleteRV() {
    return Template.instance().shiftToDeleteRV;
  },
  shiftToDelete() {
    return Template.instance().shiftToDeleteRV.get();
  },
  buttonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.listMyShifts.updateButtonContent')} <i class="material-icons right">send</i>`);
  },
  dataAvailable() {
    return Template.instance().data.dataAvailableRV.get();
  },
});

Template.myCustomersInMonth.events({
  'click #delete-for-real': function clickDeleteForReal() {
    Shifts.remove(Template.instance().shiftToDeleteRV.get(), (err) => {
      Materialize.toast(err || TAPi18n.__('crudActions.shifts.remove'), Meteor.settings.public.toastDuration);
    });
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
  'click .modal-modify-shift-trigger': function clickModalModifyShiftTrigger() {
    this.shiftToModifyRV.set(this.shift);
    AutoForm.resetForm('updateShiftForm');
  },
  'click .modal-delete-shift-trigger': function clickModalDeleteShiftTrigger() {
    this.shiftToDeleteRV.set(this.shift._id);
  },
});
