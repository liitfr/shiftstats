import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';

import { Currencies } from '../currencies/currencies.js';

const Countries = new Mongo.Collection('countries');

const CountriesSchema = new SimpleSchema({
  alpha2: {
    type: String,
    label: () => TAPi18n.__('schemas.countries.alpha2.label'),
  },
  alpha3: {
    type: String,
    label: () => TAPi18n.__('schemas.countries.alpha3.label'),
  },
  countryCallingCodes: {
    type: Array,
    label: () => TAPi18n.__('schemas.countries.countryCallingCodes.label'),
  },
  'countryCallingCodes.$': {
    type: String,
    label: () => TAPi18n.__('schemas.countries.countryCallingCode.label'),
  },
  currencies: {
    type: Array,
    label: () => TAPi18n.__('schemas.countries.currencies.label'),
  },
  'currencies.$': {
    type: String,
    label: () => TAPi18n.__('schemas.countries.currency.label'),
  },
  ioc: {
    type: String,
    optional: true,
    label: () => TAPi18n.__('schemas.countries.ioc.label'),
  },
  languages: {
    type: Array,
    label: () => TAPi18n.__('schemas.countries.languages.label'),
  },
  'languages.$': {
    type: String,
    label: () => TAPi18n.__('schemas.countries.language.label'),
  },
  name: {
    type: String,
    label: () => TAPi18n.__('schemas.countries.name.label'),
  },
  status: {
    type: String,
    label: () => TAPi18n.__('schemas.countries.status.label'),
  },
}, {
  tracker: Tracker,
});

Countries.attachSchema(CountriesSchema);

Countries.publicFields = {
  _id: 1,
  alpha2: 1,
  name: 1,
  currencies: 1,
};

Countries.helpers({
  getFirstCurrency() {
    Currencies.findOne({
      code: this.currencies[0],
    }, {});
  },
});

export { Countries, CountriesSchema };
