import { moment } from 'meteor/momentjs:moment';
import { TAPi18n } from 'meteor/tap:i18n';

import { Shifts } from '../../../api/shifts/shifts.js';

import '../../components/loader/loader.js';

import './list-shifts.html';

Template.listShifts.onCreated(function listShiftsOnCreated() {
  // TODO : as seen in tutorial & blaze doc, we should use SimpleSchema here too
  // LIIT : seems like we don't need autorun ?!
  this.subscribe('shifts.mine');
  this.selectedShiftId = new ReactiveVar();
});

// LIIT : check that shift day isn't UTC in database
Template.listShifts.onRendered(() => {
  $('.modal').modal();
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

Template.listShifts.helpers({
  selectedShift() {
    return Shifts.findOne({
      _id: Template.instance().selectedShiftId.get(),
    }, {});
  },
  Shifts() {
    return Shifts;
  },
  formId() {
    return `updateShiftForm-${Template.instance().selectedShiftId.get()}`;
  },
  updateButtonContent() {
    return Spacebars.SafeString(`${TAPi18n.__('components.listShifts.updateButtonContent')}
    <i class="material-icons right">loop</i>`);
  },
  shifts() {
    return Shifts.find({}, {
      sort: {
        date: -1,
        endHour: -1,
        startHour: -1,
      },
    });
  },
});

// TODO : message if no shift has been added yet !

// BUG we should not use data-attr : https://dweldon.silvrback.com/common-mistakes
// or use url hashes like https://guide.meteor.com/data-loading.html#organizing-subscriptions
Template.listShifts.events({
  'click .modal-trigger': function eventModalTrigger(event, templateInstance) {
    templateInstance.selectedShiftId.set($(event.currentTarget).attr('data-shift'));
  },
});

// -----------------------------------------------------------------------------

Template.shiftsItem.helpers({
  formatedDate() {
    console.log(amplify.store('date-format'));
    return moment(this.shift.date).format(amplify.store('date-format'));
  },
});

// Template.shiftsItem.events({
//   'click .modal-trigger': function eventModalTrigger(event, templateInstance) {
//     // templateInstance.selectedShiftId.set($(event.currentTarget).attr('data-shift'));
//     console.log(templateInstance);
//   },
// });
