import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import { Mongo } from 'meteor/mongo';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Customers } from '../customers/customers.js';

// TODO : index on analytics fields
// TODO : message about the shortest the shift is the better it is
// TODO : when customer + date chosen : display related calculation fields
// TODO : control that hours are in right order and date not in futur
// TODO : add methods to get courier (watch out user permission) & customer
// TODO : complete fields lists

const Shifts = new Mongo.Collection('shifts');

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
        return courier.username !== undefined ? courier.username : courier.services.facebook.name;
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
        options: () => Customers.find({}, { sort: {
          label: 1,
        } }).map(customer => ({
          label: customer.label,
          value: customer._id,
        })),
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
    denyUpdate: true,
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
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  customerLabel: {
    type: String,
    denyUpdate: true,
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
      this.unset();
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
        return moment(new Date(year, month, day)).day();
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
  duration: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.shifts.duration.label'),
    autoValue() {
      if (this.field('startHour').isSet && this.field('endHour').isSet) {
        const startHour = this.field('startHour').value;
        const endHour = this.field('endHour').value;
        return ((parseInt(endHour.split(':')[0], 10) * 60) + (parseInt(endHour.split(':')[1], 10))) - ((parseInt(startHour.split(':')[0], 10) * 60) + (parseInt(startHour.split(':')[1], 10)));
      }
      this.unset();
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  startDatetime: {
    type: Date,
    label: () => TAPi18n.__('schemas.shifts.startdatetime.label'),
    autoValue() {
      if (this.field('customer') && this.field('startHour').isSet && this.field('date').isSet) {
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
        // console.log(d)
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
      if (this.field('customer') && this.field('endHour').isSet && this.field('date').isSet) {
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
        // console.log(d)
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

Shifts.attachSchema(ShiftsSchema);

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
  customerLabel: 1,
  date: 1,
  dayOfTheWeek: 1,
  month: 1,
  startHour: 1,
  endHour: 1,
  duration: 1,
  startDatetime: 1,
  endDatetime: 1,
  counter: 1,
  nbDelivs: 1,
  nbKms: 1,
  gains: 1,
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

Shifts.helpers({
  getCourier() {
    if (this.courier === this.userId) {
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

export { Shifts, ShiftsSchema };
