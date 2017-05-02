import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Customers } from '../customers/customers.js';

// TODO : index on analytics fields
// TODO : message about the shortest the shift is the better it is
// TODO : complete fields lists
// TODO : verify if all fields are really necessary and think about their format (date for example).

const Shifts = new Mongo.Collection('shifts');

const applyMorningOffset = (time) => {
  const timeMinutesWithOffsetInt = (parseInt(time.substring(3, 5), 10) -
    parseInt(Meteor.settings.public.morningStartHour.substring(3, 5), 10)) % 60;
  let timeHoursWithOffsetInt = (parseInt(time.substring(0, 2), 10) -
    parseInt(Meteor.settings.public.morningStartHour.substring(0, 2), 10));
  if (parseInt(time.substring(3, 5), 10) -
    parseInt(Meteor.settings.public.morningStartHour.substring(3, 5), 10) < 0) {
    timeHoursWithOffsetInt -= 1;
  }
  timeHoursWithOffsetInt = (timeHoursWithOffsetInt + 24) % 24;
  return `${`0${timeHoursWithOffsetInt}`.slice(-2)}:${`0${timeMinutesWithOffsetInt}`.slice(-2)}`;
};

const calcDuration = (startHour, endHour) => {
  const startHourWithOffset = applyMorningOffset(startHour);
  const endHourWithOffset = applyMorningOffset(endHour);
  const duration = ((parseInt(endHourWithOffset.split(':')[0], 10) * 60) + (parseInt(endHourWithOffset.split(':')[1], 10))) -
  ((parseInt(startHourWithOffset.split(':')[0], 10) * 60) + (parseInt(startHourWithOffset.split(':')[1], 10)));
  return duration;
};

const distribute = (startShiftStr, endShiftStr, startPeriodStr, endPeriodStr, ratio) => {
  const startShiftInt = parseInt(applyMorningOffset(startShiftStr).replace(':', ''), 10);
  const endShiftInt = parseInt(applyMorningOffset(endShiftStr).replace(':', ''), 10);
  const startPeriodInt = parseInt(applyMorningOffset(startPeriodStr).replace(':', ''), 10);
  let endPeriodInt = parseInt(applyMorningOffset(endPeriodStr).replace(':', ''), 10);
  if (endPeriodInt === 0) {
    endPeriodInt = 2400;
  }
  if (startShiftInt < endPeriodInt && endShiftInt > startPeriodInt) {
    let calcRatio = calcDuration(startShiftInt >= startPeriodInt ? startShiftStr : startPeriodStr,
      endShiftInt <= endPeriodInt ? endShiftStr : endPeriodStr);
    if (ratio) {
      calcRatio /= calcDuration(startShiftStr, endShiftStr);
    }
    return calcRatio;
  }
  return 0;
};

//----------------------------------------------------------------------------
// Schema
//----------------------------------------------------------------------------

const ShiftsSchema = new SimpleSchema({
  //----------------------------------------------------------------------------
  // Courier
  //----------------------------------------------------------------------------
  courier: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => TAPi18n.__('schemas.shifts.courier.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  courierUsername: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.users.username.label'),
    autoValue() {
      if (this.isInsert && this.field('courier').isSet) {
        const courier = Meteor.users.findOne({
          _id: this.field('courier').value,
        }, {
          fields: {
            username: 1,
            services: 1,
          },
        });
        if (courier) {
          return courier.username !== undefined ? courier.username : courier.services.facebook.name;
        }
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  courierEmail: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.users.email.label'),
    autoValue() {
      if (this.isInsert && this.field('courier').isSet) {
        const courier = Meteor.users.findOne({
          _id: this.field('courier').value,
        }, {
          fields: {
            emails: 1,
            services: 1,
          },
        });
        return courier.emails[0].address !== undefined ?
        courier.emails[0].address : courier.services.facebook.name;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  // Customer
  //----------------------------------------------------------------------------
  customer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => TAPi18n.__('schemas.shifts.customer.label'),
    allowedValues: () => Customers.find().map(customer => customer._id),
    denyUpdate: true,
    autoform: {
      afFieldInput: {
        defaultValue: () => SessionAmplify.get('shiftstats-user-favorite-customer'),
        firstOption: () => TAPi18n.__('schemas.shifts.customer.placeholder'),
        class: 'select-customer',
        options: () => {
          if (Meteor.isClient) {
            Tracker.afterFlush(() => {
              $('select[name$="customer"]').material_select();
            });
          }
          return Customers.find({}, { sort: {
            label: 1,
          } }).map(customer => ({
            label: customer.label,
            value: customer._id,
          }));
        },
      },
    },
  },
  //----------------------------------------------------------------------------
  country: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.customers.country.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            country: 1,
          },
        }).country;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  countryName: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.countries.name.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            countryName: 1,
          },
        }).countryName;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  currencySymbol: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.currencies.symbol.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            currencySymbol: 1,
          },
        }).currencySymbol;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  city: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.customers.city.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            city: 1,
          },
        }).city;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  cityName: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.cities.name.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            cityName: 1,
          },
        }).cityName;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  timezone: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.customers.timezone.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            timezone: 1,
          },
        }).timezone;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  timezoneAbbr: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.timezones.abbr.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            timezoneAbbr: 1,
          },
        }).timezoneAbbr;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  timezoneOffset: {
    type: Number,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.timezones.offset.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            timezoneOffset: 1,
          },
        }).timezoneOffset;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  brand: {
    type: String,
    denyUpdate: true,
    label: () => TAPi18n.__('schemas.customers.brand.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            brand: 1,
          },
        }).brand;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  contract: {
    type: String,
    label: () => TAPi18n.__('schemas.customers.contract.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            contract: 1,
          },
        }).contract;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  color: {
    type: String,
    regEx: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    label: () => TAPi18n.__('schemas.customers.color.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            color: 1,
          },
        }).color;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  customerLabel: {
    type: String,
    label: () => TAPi18n.__('schemas.customers.label.label'),
    autoValue() {
      if (this.isInsert && this.field('customer').isSet) {
        return Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            label: 1,
          },
        }).label;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  // Dates & Hours
  //----------------------------------------------------------------------------
  date: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.date.label'),
    autoform: {
      afFieldInput: {
        defaultValue: () => moment().format(TAPi18n.__('components.pickadate.format').toUpperCase()),
        type: 'datepicker',
        class: 'datepicker',
        placeholder: () => TAPi18n.__('schemas.shifts.date.placeholder'),
      },
    },
    custom() {
      if (this.value > parseInt(moment().format('YYYYMMDD'), 10)) {
        return { name: 'date', type: 'shiftInFuture' };
      }
      return undefined;
    },
  },
  //----------------------------------------------------------------------------
  dayOfTheWeek: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.dayoftheweek.label'),
    autoValue() {
      if (this.field('date').isSet) {
        const year = Math.floor(this.field('date').value / 10000);
        const month = Math.floor((this.field('date').value - (year * 10000)) / 100);
        const day = this.field('date').value - (year * 10000) - (month * 100);
        return moment(new Date(year, month - 1, day)).day();
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  dayOfTheWeekString: {
    type: String,
    label: () => TAPi18n.__('schemas.shifts.dayoftheweek.label'),
    autoValue() {
      if (this.field('date').isSet) {
        const year = Math.floor(this.field('date').value / 10000);
        const month = Math.floor((this.field('date').value - (year * 10000)) / 100);
        const day = this.field('date').value - (year * 10000) - (month * 100);
        return moment(new Date(year, month - 1, day)).day().toString();
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  month: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.month.label'),
    autoValue() {
      if (this.field('date').isSet) {
        return Math.floor(this.field('date').value / 100);
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  monthString: {
    type: String,
    label: () => TAPi18n.__('schemas.shifts.month.label'),
    autoValue() {
      if (this.field('date').isSet) {
        return (Math.floor(this.field('date').value / 100)).toString();
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  startHour: {
    type: String,
    regEx: /^([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}/,
    label: () => TAPi18n.__('schemas.shifts.starthour.label'),
    autoform: {
      afFieldInput: {
        type: 'time',
        class: 'timepicker',
      },
    },
  },
  //----------------------------------------------------------------------------
  endHour: {
    type: String,
    regEx: /^([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}/,
    label: () => TAPi18n.__('schemas.shifts.endhour.label'),
    autoform: {
      afFieldInput: {
        type: 'time',
        class: 'timepicker',
      },
    },
  },
  //----------------------------------------------------------------------------
  startDatetime: {
    type: Date,
    label: () => TAPi18n.__('schemas.shifts.startdatetime.label'),
    autoValue() {
      if (this.field('customer').isSet && this.field('startHour').isSet && this.field('date').isSet) {
        const startYear = Math.floor(this.field('date').value / 10000);
        const startMonth = Math.floor((this.field('date').value - (startYear * 10000)) / 100);
        const startDay = this.field('date').value - (startYear * 10000) - (startMonth * 100);
        const startHour = parseInt(this.field('startHour').value.split(':')[0], 10);
        const startMin = parseInt(this.field('startHour').value.split(':')[1], 10);
        const offset = Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            timezoneOffset: 1,
          },
        }).timezoneOffset;
        const d = new Date(Date.UTC(startYear, startMonth - 1, startDay, startHour, startMin));
        d.setHours(d.getHours() - offset);
        return d;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  endDatetime: {
    type: Date,
    label: () => TAPi18n.__('schemas.shifts.enddatetime.label'),
    autoValue() {
      if (this.field('customer').isSet && this.field('endHour').isSet && this.field('date').isSet) {
        const endYear = Math.floor(this.field('date').value / 10000);
        const endMonth = Math.floor((this.field('date').value - (endYear * 10000)) / 100);
        const endDay = this.field('date').value - (endYear * 10000) - (endMonth * 100);
        const endHour = parseInt(this.field('endHour').value.split(':')[0], 10);
        const endMin = parseInt(this.field('endHour').value.split(':')[1], 10);
        const offset = Customers.findOne({
          _id: this.field('customer').value,
        }, {
          fields: {
            timezoneOffset: 1,
          },
        }).timezoneOffset;
        const d = new Date(Date.UTC(endYear, endMonth - 1, endDay, endHour, endMin));
        d.setHours(d.getHours() - offset);
        return d;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  // KPIs
  //----------------------------------------------------------------------------
  counter: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.counter.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert) {
        return 1;
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbDelivs: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.nbdelivs.label'),
    min: 0,
    autoform: {
      afFieldInput: {
        type: 'number',
        pattern: '[0-9]',
        step: '1',
      },
    },
  },
  //----------------------------------------------------------------------------
  nbKms: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbkms.label'),
    min: 0,
    autoform: {
      afFieldInput: {
        type: 'number',
        step: '0.1',
      },
    },
  },
  //----------------------------------------------------------------------------
  gains: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.gains.label'),
    min: 0,
    autoform: {
      afFieldInput: {
        type: 'number',
        step: '0.1',
      },
    },
  },
  //----------------------------------------------------------------------------
  duration: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return calcDuration(this.field('startHour').value, this.field('endHour').value);
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  counterMorning: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.counter.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.morningStartHour, Meteor.settings.public.morningEndHour, false) > 0 ? 1 : 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbDelivsMorning: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbdelivs.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbDelivs').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.morningStartHour, Meteor.settings.public.morningEndHour, true) * this.field('nbDelivs').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbKmsMorning: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbkms.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbKms').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.morningStartHour, Meteor.settings.public.morningEndHour, true) * this.field('nbKms').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  gainsMorning: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.gains.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('gains').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.morningStartHour, Meteor.settings.public.morningEndHour, true) * this.field('gains').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  durationMorning: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.morningStartHour, Meteor.settings.public.morningEndHour, false);
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  counterLunch: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.counter.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.lunchStartHour, Meteor.settings.public.lunchEndHour, false) > 0 ? 1 : 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbDelivsLunch: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbdelivs.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbDelivs').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.lunchStartHour, Meteor.settings.public.lunchEndHour, true) * this.field('nbDelivs').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbKmsLunch: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbkms.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbKms').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.lunchStartHour, Meteor.settings.public.lunchEndHour, true) * this.field('nbKms').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  gainsLunch: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.gains.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('gains').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.lunchStartHour, Meteor.settings.public.lunchEndHour, true) * this.field('gains').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  durationLunch: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.lunchStartHour, Meteor.settings.public.lunchEndHour, false);
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  counterAfternoon: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.counter.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.afternoonStartHour, Meteor.settings.public.afternoonEndHour, false) > 0 ? 1 : 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbDelivsAfternoon: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbdelivs.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbDelivs').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.afternoonStartHour, Meteor.settings.public.afternoonEndHour, true) * this.field('nbDelivs').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbKmsAfternoon: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbkms.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbKms').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.afternoonStartHour, Meteor.settings.public.afternoonEndHour, true) * this.field('nbKms').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  gainsAfternoon: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.gains.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('gains').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.afternoonStartHour, Meteor.settings.public.afternoonEndHour, true) * this.field('gains').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  durationAfternoon: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.afternoonStartHour, Meteor.settings.public.afternoonEndHour, false);
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  counterDinner: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.counter.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.dinnerStartHour, Meteor.settings.public.dinnerEndHour, false) > 0 ? 1 : 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbDelivsDinner: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbdelivs.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbDelivs').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.dinnerStartHour, Meteor.settings.public.dinnerEndHour, true) * this.field('nbDelivs').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbKmsDinner: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbkms.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbKms').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.dinnerStartHour, Meteor.settings.public.dinnerEndHour, true) * this.field('nbKms').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  gainsDinner: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.gains.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('gains').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.dinnerStartHour, Meteor.settings.public.dinnerEndHour, true) * this.field('gains').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  durationDinner: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.dinnerStartHour, Meteor.settings.public.dinnerEndHour, false);
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  counterNight: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.counter.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.nightStartHour, Meteor.settings.public.nightEndHour, false) > 0 ? 1 : 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbDelivsNight: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbdelivs.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbDelivs').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.nightStartHour, Meteor.settings.public.nightEndHour, true) * this.field('nbDelivs').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  nbKmsNight: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.nbkms.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('nbKms').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.nightStartHour, Meteor.settings.public.nightEndHour, true) * this.field('nbKms').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  gainsNight: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.gains.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet && this.field('gains').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.nightStartHour, Meteor.settings.public.nightEndHour, true) * this.field('gains').value;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  durationNight: {
    type: Number,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        return distribute(this.field('startHour').value, this.field('endHour').value, Meteor.settings.public.nightStartHour, Meteor.settings.public.nightEndHour, false);
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  // Technical
  //----------------------------------------------------------------------------
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
      return undefined;
    },
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true,
    },
  },
}, {
  tracker: Tracker,
});

ShiftsSchema.addDocValidator((shift) => {
  if (_.has(shift, 'startHour') && _.has(shift, 'endHour')) {
    if (shift.startHour === shift.endHour) {
      return [
        { name: 'startHour', type: 'noDuration' },
        { name: 'endHour', type: 'noDuration' },
      ];
    }
    const startHourWithOffset = applyMorningOffset(shift.startHour);
    const endHourWithOffset = applyMorningOffset(shift.endHour);
    const startHourWithOffsetInt = parseInt(startHourWithOffset.replace(':', ''), 10);
    const endHourWithOffsetInt = parseInt(endHourWithOffset.replace(':', ''), 10);
    if (endHourWithOffsetInt < startHourWithOffsetInt) {
      return [
        { name: 'startHour', type: 'dayOverlap' },
        { name: 'endHour', type: 'dayOverlap' },
      ];
    }
  }
  return [];
});

Shifts.attachSchema(ShiftsSchema);

//----------------------------------------------------------------------------
// Fields
//----------------------------------------------------------------------------

Shifts.adminFields = {
  _id: 1,
  courier: 1,
  courierUsername: 1,
  courierEmail: 1,
  customer: 1,
  country: 1,
  countryName: 1,
  currencySymbol: 1,
  city: 1,
  cityName: 1,
  timezone: 1,
  timezoneAbbr: 1,
  timezoneOffset: 1,
  brand: 1,
  contract: 1,
  color: 1,
  customerLabel: 1,
  date: 1,
  dayOfTheWeek: 1,
  dayOfTheWeekString: 1,
  month: 1,
  monthString: 1,
  startHour: 1,
  endHour: 1,
  startDatetime: 1,
  endDatetime: 1,
  counter: 1,
  nbDelivs: 1,
  nbKms: 1,
  gains: 1,
  duration: 1,
  counterMorning: 1,
  nbDelivsMorning: 1,
  nbKmsMorning: 1,
  gainsMorning: 1,
  durationMorning: 1,
  counterLunch: 1,
  nbDelivsLunch: 1,
  nbKmsLunch: 1,
  gainsLunch: 1,
  durationLunch: 1,
  counterAfternoon: 1,
  nbDelivsAfternoon: 1,
  nbKmsAfternoon: 1,
  gainsAfternoon: 1,
  durationAfternoon: 1,
  counterDinner: 1,
  nbDelivsDinner: 1,
  nbKmsDinner: 1,
  gainsDinner: 1,
  durationDinner: 1,
  counterNight: 1,
  nbDelivsNight: 1,
  nbKmsNight: 1,
  gainsNight: 1,
  durationNight: 1,
  createdAt: 1,
  updatedAt: 1,
};

Shifts.userFields = {
  city: 1,
  cityName: 1,
  brand: 1,
  contract: 1,
  date: 1,
  startHour: 1,
  endHour: 1,
  nbDelivs: 1,
  nbKms: 1,
  gains: 1,
};

//----------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------

Shifts.helpers({
  getCourier() {
    if (this.courier === this.userId || Roles.userIsInRole(this.userId, 'admin')) {
      return Meteor.users.findOne({
        _id: this.courier,
      }, {});
    }
    return undefined;
  },
  getCustomer() {
    return Customers.findOne({
      _id: this.customer,
    }, {});
  },
});

//----------------------------------------------------------------------------
// Hooks
//----------------------------------------------------------------------------

Shifts.after.insert((userId, doc) => {
  if (Meteor.isServer) {
    const incUser = {
      shiftsCounter: 1,
      delivsCounter: doc.nbDelivs,
      kmsCounter: doc.nbKms,
      gainsCounter: doc.gains,
    };
    incUser[`customers.${doc.customer}`] = 1;
    incUser[`months.${doc.monthString}`] = 1;
    Meteor.users.update({
      _id: userId,
    }, {
      $inc: incUser,
    });
  }
});

Shifts.after.update(function shiftsAfterUpdate(userId, doc, fieldNames) {
  if (Meteor.isServer) {
    const incUser = {};
    if (_.indexOf(fieldNames, 'nbDelivs') !== -1) {
      incUser.delivsCounter = doc.nbDelivs - this.previous.nbDelivs;
    }
    if (_.indexOf(fieldNames, 'nbKms') !== -1) {
      incUser.kmsCounter = doc.nbKms - this.previous.nbKms;
    }
    if (_.indexOf(fieldNames, 'gains') !== -1) {
      incUser.gainsCounter = doc.gains - this.previous.gains;
    }
    if (_.indexOf(fieldNames, 'customer') !== -1 && doc.customer !== this.previous.customer) {
      incUser[`customers.${doc.customer}`] = 1;
      incUser[`customers.${this.previous.customer}`] = -1;
    }
    if (_.indexOf(fieldNames, 'month') !== -1 && doc.monthString !== this.previous.monthString) {
      incUser[`months.${doc.monthString}`] = 1;
      incUser[`months.${this.previous.monthString}`] = -1;
    }
    Meteor.users.update({
      _id: userId,
    }, {
      $inc: incUser,
    });
  }
}, { fetchPrevious: true });

Shifts.after.remove((userId, doc) => {
  if (Meteor.isServer) {
    const incUser = {
      shiftsCounter: -1,
      delivsCounter: -doc.nbDelivs,
      kmsCounter: -doc.nbKms,
      gainsCounter: -doc.gains,
    };
    incUser[`customers.${doc.customer}`] = -1;
    incUser[`months.${doc.monthString}`] = -1;
    Meteor.users.update({
      _id: userId,
    }, {
      $inc: incUser,
    });
  }
});

export { Shifts, ShiftsSchema };
