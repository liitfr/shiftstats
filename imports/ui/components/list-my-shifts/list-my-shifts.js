// import { moment } from 'meteor/momentjs:moment';
// import { TAPi18n } from 'meteor/tap:i18n';

import { Shifts } from '../../../api/shifts/shifts.js';

import '../../components/loader/loader.js';

import './list-my-shifts.html';

// const MyShifts = new Mongo.Collection('myshifts');

Template.listMyShifts.onCreated(function listMyShiftsOnCreated() {
  // TODO : as seen in tutorial & blaze doc, we should use SimpleSchema here too
  // LIIT : seems like we don't need autorun ?!
  const template = this;
  // template.autorun(() => {
    template.subscribe('shifts.mine');
  // });
  // template.selectedShiftId = new ReactiveVar();
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

Template.listMyShifts.helpers({
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

// TODO : message if no shift has been added yet !

// BUG we should not use data-attr : https://dweldon.silvrback.com/common-mistakes
// or use url hashes like https://guide.meteor.com/data-loading.html#organizing-subscriptions
// Template.listMyShifts.events({
//   'click .modal-trigger': function clickModalTrigger(event, templateInstance) {
//     templateInstance.selectedShiftId.set($(event.currentTarget).attr('data-shift'));
//   },
// });

// -----------------------------------------------------------------------------

// Template.shiftsItem.helpers({
//   formatedDate() {
//     // console.log(amplify.store('date-format'));
//     // return moment(this.shift.date).format(amplify.store('date-format'));
//     return this.shift.date;
//   },
// });

// Template.shiftsItem.events({
//   'click .modal-trigger': function eventModalTrigger(event, templateInstance) {
//     // templateInstance.selectedShiftId.set($(event.currentTarget).attr('data-shift'));
//     console.log(templateInstance);
//   },
// });
