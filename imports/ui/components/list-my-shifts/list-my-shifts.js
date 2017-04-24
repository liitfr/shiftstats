import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import { Shifts } from '../../../api/shifts/shifts.js';

import '../loader/loader.js';

import './list-my-shifts.html';

Template.listMyShifts.onCreated(function listMyShiftsOnCreated() {
  this.monthToDisplay = new ReactiveVar();
});

Template.listMyShifts.helpers({
  monthToDisplay() {
    return Template.instance().monthToDisplay;
  },
//   selectedShift() {
//     return Shifts.findOne({
//       _id: Template.instance().selectedShiftId.get(),
//     }, {});
//   },
  // MyShifts() {
  //   return MyShifts.find();
  // },
//   formId() {
//     return `updateShiftForm-${Template.instance().selectedShiftId.get()}`;
//   },
//   updateButtonContent() {
//     return Spacebars.SafeString(`${TAPi18n.__('components.listShifts.updateButtonContent')}
//     <i class="material-icons right">loop</i>`);
//   },
//   shifts() {
//     return Shifts.find({}, {
//       sort: {
//         date: -1,
//         endHour: -1,
//         startHour: -1,
//       },
//     });
//   },
});

// -----------------------------------------------------------------------------

Template.myMonthsList.onCreated(function myMonthsListOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('users.me', () => {
      template.data.monthToDisplay.set(_.max(Object.keys(Meteor.users.findOne().months)));
      Tracker.afterFlush(() => {
        template.$('select').material_select();
      });
    });
  });
});

Template.myMonthsList.helpers({
  myMonths() {
    return _.map(_.sortBy(Object.keys(Meteor.users.findOne().months), month => -month), month => ({
      value: month,
      label: `${TAPi18n.__(`components.pickadate.monthsFull.${parseInt(month.substring(4, 6), 10) - 1}`)} ${month.substring(0, 4)}`,
    }));
  },
});

Template.myMonthsList.events({
  'change #my-months-list': function changeMonthSelect(event, templateInstance) {
    templateInstance.data.monthToDisplay.set(event.target.value);
  },
});

// -----------------------------------------------------------------------------

Template.myCustomersInMonth.onCreated(function myCustomersInMonthOnCreated() {
  const template = this;
  template.shiftToModify = new ReactiveVar();
  template.autorun(() => {
    if (template.data.monthToDisplay.get() !== undefined) {
      template.subscribe('shifts.mine', template.data.monthToDisplay.get());
    }
  });
});

Template.myCustomersInMonth.helpers({
  shifts() {
    return Shifts.find();
  },
  shiftToModify() {
    return Template.instance().shiftToModify;
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
// LIIT : check that shift day isn't UTC in database
// Template.listMyShifts.onRendered(function listMyShiftsOnRendered() {
//   $('.modal').modal();
//   $('.datepicker').pickadate({
//     selectMonths: true,
//     selectYears: 2,
//     format: 'dd/mm/yyyy',
//     closeOnSelect: true,
//     closeOnClear: true,
//     max: new Date(),
//     onSet(ele) {
//       if (ele.select) {
//         this.close();
//       }
//     },
//   });
// });

// TODO : message if no shift has been added yet !

// BUG we should not use data-attr : https://dweldon.silvrback.com/common-mistakes
// or use url hashes like https://guide.meteor.com/data-loading.html#organizing-subscriptions
// Template.listMyShifts.events({
//   'click .modal-trigger': function clickModalTrigger(event, templateInstance) {
//     templateInstance.selectedShiftId.set($(event.currentTarget).attr('data-shift'));
//   },
// });

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
  'click .modal-trigger': function eventModalTrigger(event, templateInstance) {
    // templateInstance.selectedShiftId.set($(event.currentTarget).attr('data-shift'));
    // console.log(templateInstance);
  },
});
