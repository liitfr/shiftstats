import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

const Currencies = new Mongo.Collection('currencies');

//----------------------------------------------------------------------------
// Schema
//----------------------------------------------------------------------------

const CurrenciesSchema = new SimpleSchema({
  code: {
    type: String,
    label: () => TAPi18n.__('schemas.currencies.code.label'),
  },
  name: {
    type: String,
    label: () => TAPi18n.__('schemas.currencies.name.label'),
  },
  rate: {
    type: Number,
    label: () => TAPi18n.__('schemas.currencies.rate.label'),
  },
  symbol: {
    type: String,
    label: () => TAPi18n.__('schemas.currencies.symbol.label'),
  },
}, {
  tracker: Tracker,
});

Currencies.attachSchema(CurrenciesSchema);

//----------------------------------------------------------------------------
// Fields
//----------------------------------------------------------------------------

Currencies.publicFields = {
  _id: 1,
  code: 1,
  name: 1,
  symbol: 1,
};

export { Currencies, CurrenciesSchema };
