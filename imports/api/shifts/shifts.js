/* global amplify */

// HACK : Had to define amplify as global since I didn't find what package to include ...

import { moment } from 'meteor/momentjs:moment';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import { Customers } from '../customers/customers.js';

// TODO : index on analytics fields
// TODO : denormalize city, brand, contract
// TODO : message about the shortest the shift is the better it is
// TODO : security control that user === user
// TODO : when customer + date chosen : display related calculation fields
// TODO : save user choices for city / brand / contract in amplify
// TODO : should we control if user has already defined a shift on this period ?
// TODO : use materialize date picker ?
// TODO : control that hours are in right order and date not in futur
// TODO : save choice of customer in client
// TODO : should city / brand / contract be in 3 fields ?

const Shifts = new Mongo.Collection('shifts');

const ShiftsSchema = new SimpleSchema({
  courier: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => TAPi18n.__('schemas.shifts.courier.label'),
    denyUpdate: true,
    autoValue() {
      return this.userId;
    },
    autoform: {
      omit: true,
    },
  },
  customer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => TAPi18n.__('schemas.shifts.customer.label'),
    allowedValues: () => Customers.find().map(customer => customer._id),
    denyUpdate: true,
    autoform: {
      afFieldInput: {
        // defaultValue: () => amplify.store('autoform-favorite-customer'),
        firstOption: () => TAPi18n.__('schemas.shifts.customer.placeholder'),
        class: 'select-customer',
        // LIIT : This is not reactive. If you want to make it reactive, check this link
        // https://github.com/aldeed/meteor-autoform/issues/247
        // Idea comes from : https://forums.meteor.com/t/dependant-drop-down-list/8192/3
        options: () => Customers.find({}, { sort: {
          city: 1,
          brand: 1,
          contract: 1,
        } }).map(customer => ({
          label: customer.label,
          value: customer._id,
        })),
      },
    },
  },
  city: {
    type: String,
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
  // TODO : date picker displayed in french
  date: {
    type: Date,
    label: () => TAPi18n.__('schemas.shifts.date.label'),
    autoform: {
      afFieldInput: {
        // TODO : i18n format
        defaultValue: moment().format('DD/MM/YYYY'),
        type: 'datepicker',
        class: 'datepicker',
        placeholder: () => TAPi18n.__('schemas.shifts.date.placeholder'),
      },
    },
  },
  startHour: {
    type: String,
    regEx: /^([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}/,
    label: () => TAPi18n.__('schemas.shifts.starthour.label'),
    autoform: {
      afFieldInput: {
        type: 'time',
      },
    },
  },
  endHour: {
    type: String,
    regEx: /^([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}/,
    label: () => TAPi18n.__('schemas.shifts.endhour.label'),
    autoform: {
      afFieldInput: {
        type: 'time',
      },
    },
  },
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
}, {
  clean: {
    filter: true,
    autoConvert: true,
    removeEmptyStrings: true,
    trimStrings: true,
    getAutoValues: true,
    removeNullsFromArrays: true,
  },
});

Shifts.attachSchema(ShiftsSchema);

Shifts.adminFields = {
  _id: 1,
  courier: 1,
  customer: 1,
  city: 1,
  brand: 1,
  contract: 1,
  date: 1,
  startHour: 1,
  endHour: 1,
  nbDelivs: 1,
  nbKms: 1,
  gains: 1,
  createdAt: 1,
  updatedAt: 1,
};

Shifts.userFields = {
  city: 1,
  brand: 1,
  contract: 1,
  date: 1,
  startHour: 1,
  endHour: 1,
  nbDelivs: 1,
  nbKms: 1,
  gains: 1,
};

export { Shifts, ShiftsSchema };
