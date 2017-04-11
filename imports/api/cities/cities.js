import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';

const Cities = new Mongo.Collection('cities');

const CitiesSchema = new SimpleSchema({
  name: {
    type: String,
    label: () => TAPi18n.__('schemas.cities.name.label'),
  },
  country: {
    type: String,
    label: () => TAPi18n.__('schemas.cities.country.label'),
  },
  altCountry: {
    type: String,
    optional: true,
    label: () => TAPi18n.__('schemas.cities.altCountry.label'),
  },
  muni: {
    type: String,
    optional: true,
    label: () => TAPi18n.__('schemas.cities.muni.label'),
  },
  muniSub: {
    type: String,
    optional: true,
    label: () => TAPi18n.__('schemas.cities.muniSub.label'),
  },
  featureClass: {
    type: String,
    optional: true,
    label: () => TAPi18n.__('schemas.cities.featureClass.label'),
  },
  featureCode: {
    type: String,
    label: () => TAPi18n.__('schemas.cities.featureCode.label'),
  },
  adminCode: {
    type: String,
    optional: true,
    label: () => TAPi18n.__('schemas.cities.adminCode.label'),
  },
  population: {
    type: Number,
    label: () => TAPi18n.__('schemas.cities.population.label'),
  },
  lat: {
    type: Number,
    label: () => TAPi18n.__('schemas.cities.lat.label'),
  },
  lon: {
    type: Number,
    label: () => TAPi18n.__('schemas.cities.lon.label'),
  },
}, {
  tracker: Tracker,
});

Cities.attachSchema(CitiesSchema);

Cities.publicFields = {
  _id: 1,
  name: 1,
  country: 1,
};

export { Cities, CitiesSchema };
