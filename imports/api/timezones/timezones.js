import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

const Timezones = new Mongo.Collection('timezones');

//----------------------------------------------------------------------------
// Schema
//----------------------------------------------------------------------------

const TimezonesSchema = new SimpleSchema({
  value: {
    type: String,
    label: () => TAPi18n.__('schemas.timezones.value.label'),
  },
  abbr: {
    type: String,
    label: () => TAPi18n.__('schemas.timezones.abbr.label'),
  },
  offset: {
    type: Number,
    label: () => TAPi18n.__('schemas.timezones.offset.label'),
  },
  isdst: {
    type: Boolean,
    label: () => TAPi18n.__('schemas.timezones.isdst.label'),
  },
  text: {
    type: String,
    label: () => TAPi18n.__('schemas.timezones.text.label'),
  },
  utc: {
    type: Array,
    optional: true,
    label: () => TAPi18n.__('schemas.timezones.utc.label'),
  },
  'utc.$': {
    type: String,
    label: () => TAPi18n.__('schemas.timezones.utc.label'),
  },
}, {
  tracker: Tracker,
});

Timezones.attachSchema(TimezonesSchema);

//----------------------------------------------------------------------------
// Fields
//----------------------------------------------------------------------------

Timezones.publicFields = {
  _id: 1,
  abbr: 1,
  offset: 1,
  text: 1,
};

export { Timezones, TimezonesSchema };
