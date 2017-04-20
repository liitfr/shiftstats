import { AutoForm } from 'meteor/aldeed:autoform';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Cities } from '../cities/cities.js';
import { Currencies } from '../currencies/currencies.js';
import { Countries } from '../countries/countries.js';
import { Shifts } from '../shifts/shifts.js';
import { Timezones } from '../timezones/timezones.js';

const Customers = new Mongo.Collection('customers');

//----------------------------------------------------------------------------
// Schema
//----------------------------------------------------------------------------

const CustomersSchema = new SimpleSchema({
  country: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => TAPi18n.__('schemas.customers.country.label'),
    allowedValues: () => Countries.find().map(country => country._id),
    denyUpdate: true,
    autoform: {
      type: 'select',
      firstOption: () => TAPi18n.__('schemas.customers.country.placeholder'),
      options: () => Countries.find({}, { sort: {
        name: 1,
      } }).map(country => ({
        label: country.name,
        value: country._id,
      })),
    },
  },
  //----------------------------------------------------------------------------
  countryName: {
    type: String,
    label: () => TAPi18n.__('schemas.countries.name.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert && this.field('country').isSet) {
        return Countries.findOne({
          _id: this.field('country').value,
        }, {
          fields: {
            name: 1,
          },
        }).name;
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
    label: () => TAPi18n.__('schemas.currencies.symbol.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert && this.field('country').isSet) {
        const currencyOfCountry = Countries.findOne({
          _id: this.field('country').value,
        }, {
          fields: {
            currencies: 1,
          },
        }).currencies[0];
        if (currencyOfCountry) {
          const currency = Currencies.findOne({
            code: currencyOfCountry,
          }, {
            fields: {
              symbol: 1,
            },
          });
          if (currency) {
            return currency.symbol;
          }
          return currencyOfCountry;
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
  city: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => TAPi18n.__('schemas.customers.city.label'),
    custom() {
      const selectedCountry = Countries.findOne({ _id: this.field('country').value }, { fields: { alpha2: 1 } }).alpha2;
      const cityExists = !!Cities.findOne({
        _id: this.value,
        country: selectedCountry,
      }, {});
      if (!cityExists) {
        return { name: 'city', type: 'cityNotInCountry' };
      }
      return undefined;
    },
    denyUpdate: true,
    autoform: {
      type: 'select',
      firstOption: () => TAPi18n.__('schemas.customers.city.placeholder'),
      options: () => {
        const countryField = Countries.findOne({
          _id: AutoForm.getFieldValue('country'),
        }, {
          fields: {
            alpha2: 1,
          },
        });
        if (countryField !== undefined) {
          Tracker.afterFlush(() => {
            $('select[name$="city"]').material_select();
          });
          return Cities.find({
            country: countryField.alpha2,
          }, { sort: {
            name: 1,
          } }).map(city => ({
            label: city.name,
            value: city._id,
          }));
        }
        return undefined;
      },
    },
  },
  //----------------------------------------------------------------------------
  cityName: {
    type: String,
    label: () => TAPi18n.__('schemas.cities.name.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert && this.field('city').isSet) {
        return Cities.findOne({
          _id: this.field('city').value,
        }, {
          fields: {
            name: 1,
          },
        }).name;
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
    label: () => TAPi18n.__('schemas.customers.timezone.label'),
    allowedValues: () => Timezones.find().map(timezone => timezone._id),
    denyUpdate: true,
    autoform: {
      type: 'select',
      firstOption: () => TAPi18n.__('schemas.customers.timezone.placeholder'),
      options: () => Timezones.find({}, { sort: {
        text: 1,
      } }).map(timezone => ({
        label: timezone.text,
        value: timezone._id,
      })),
    },
  },
  //----------------------------------------------------------------------------
  timezoneAbbr: {
    type: String,
    label: () => TAPi18n.__('schemas.timezones.abbr.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert && this.field('timezone').isSet) {
        return Timezones.findOne({
          _id: this.field('timezone').value,
        }, {
          fields: {
            abbr: 1,
          },
        }).abbr;
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
    label: () => TAPi18n.__('schemas.timezones.offset.label'),
    denyUpdate: true,
    autoValue() {
      if (this.isInsert && this.field('timezone').isSet) {
        return Timezones.findOne({
          _id: this.field('timezone').value,
        }, {
          fields: {
            offset: 1,
          },
        }).offset;
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
    allowedValues: Meteor.settings.public.brandList,
    label: () => TAPi18n.__('schemas.customers.brand.label'),
    denyUpdate: true,
    autoform: {
      type: 'select',
      firstOption: () => TAPi18n.__('schemas.customers.brand.placeholder'),
      options: () => Meteor.settings.public.brandList.map(brand => ({
        label: brand,
        value: brand,
      })),
    },
  },
  //----------------------------------------------------------------------------
  contract: {
    type: String,
    label: () => TAPi18n.__('schemas.customers.contract.label'),
    autoValue: function contractAutoValue() {
      if (this.isSet && typeof this.value === 'string') {
        return this.value.toLowerCase();
      }
      return undefined;
    },
    autoform: {
      type: 'text',
      placeholder: () => TAPi18n.__('schemas.customers.contract.placeholder'),
    },
  },
  //----------------------------------------------------------------------------
  label: {
    type: String,
    label: () => TAPi18n.__('schemas.customers.label.label'),
    autoValue() {
      if (this.isInsert && this.field('city').isSet && this.field('brand').isSet && this.field('contract').isSet) {
        const cityName = Cities.findOne({
          _id: this.field('city').value,
        }, {
          fields: {
            name: 1,
          },
        }).name;
        return `${cityName} > ${this.field('brand').value} > ${this.field('contract').value}`;
      } else if (this.isUpdate && this.field('contract').isSet) {
        const customer = Customers.findOne({
          _id: this.docId,
        }, {
          fields: {
            city: 1,
            brand: 1,
          },
        });
        if (customer !== undefined) {
          const cityName = Cities.findOne({
            _id: customer.city,
          }, {
            fields: {
              name: 1,
            },
          }).name;
          if (cityName !== undefined) {
            return `${cityName} > ${customer.brand} > ${this.field('contract').value}`;
          }
        }
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  shiftsCounter: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.customers.shiftsCounter.label'),
    autoValue() {
      if (this.isInsert) {
        return 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  couriersCounter: {
    type: SimpleSchema.Integer,
    label: () => TAPi18n.__('schemas.customers.couriersCounter.label'),
    autoValue() {
      if (this.isInsert) {
        return 0;
      }
      return undefined;
    },
    autoform: {
      omit: true,
    },
  },
  //----------------------------------------------------------------------------
  createdAt: {
    type: Date,
    label: () => TAPi18n.__('schemas.customers.createdAt.label'),
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
    label: () => TAPi18n.__('schemas.customers.updatedAt.label'),
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

CustomersSchema.addDocValidator((customer) => {
  if (_.has(customer, 'country') && _.has(customer, 'city') && _.has(customer, 'brand') && _.has(customer, 'contract')) {
    const alreadyExists = !!Customers.findOne({
      country: customer.country,
      city: customer.city,
      brand: customer.brand,
      contract: customer.contract,
    });
    if (alreadyExists) {
      return [
        { name: 'country', type: 'customerNotUnique' },
        { name: 'city', type: 'customerNotUnique' },
        { name: 'brand', type: 'customerNotUnique' },
        { name: 'contract', type: 'customerNotUnique' },
      ];
    }
  }
  return [];
});

Customers.attachSchema(CustomersSchema);

//----------------------------------------------------------------------------
// Fields
//----------------------------------------------------------------------------

Customers.adminFields = {
  _id: 1,
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
  label: 1,
  shiftsCounter: 1,
  couriersCounter: 1,
  createdAt: 1,
  updatedAt: 1,
};

Customers.publicFields = {
  _id: 1,
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
  label: 1,
};

//----------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------

Customers.helpers({
  getCountry() {
    return Countries.findOne({
      _id: this.country,
    }, {});
  },
  getCity() {
    return Cities.findOne({
      _id: this.city,
    }, {});
  },
  getTimezone() {
    return Timezones.findOne({
      _id: this.timezone,
    }, {});
  },
});

// TODO : should I do every task before and return false if error ?

//----------------------------------------------------------------------------
// Hooks
//----------------------------------------------------------------------------

Customers.after.update((userId, doc, fieldNames) => {
  if (Meteor.isServer) {
    const setShifts = {};
    fieldNames.forEach((field) => {
      setShifts[field] = doc[field];
    });
    setShifts.customerLabel = setShifts.label;
    delete setShifts.label;
    delete setShifts.updatedAt;
    Shifts.direct.update({
      customer: doc._id,
    }, {
      $set: setShifts,
    }, {
      multi: true,
    });
  }
});

Customers.after.remove((userId, doc) => {
  if (Meteor.isServer) {
    Shifts.remove({
      customer: doc._id,
    });
    const unsetUsers = {};
    unsetUsers[`customers.${doc._id}`] = '';
    Meteor.users.direct.update({
    }, {
      $unset: unsetUsers,
    }, {
      multi: true,
    });
  }
});

export { Customers, CustomersSchema };
