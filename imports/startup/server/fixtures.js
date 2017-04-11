import cities from 'all-the-cities';
import countries from 'country-data';
import currencies from 'currencies';
import timezones from 'timezones.json';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Cities } from '../../api/cities/cities.js';
import { Countries } from '../../api/countries/countries.js';
import { Currencies } from '../../api/currencies/currencies.js';
import { Customers } from '../../api/customers/customers.js';
import { Timezones } from '../../api/timezones/timezones.js';

Meteor.startup(() => {
  // ---------------------------------------------------------------------------
  // Admin user
  let adminId;
  let timestamp = (new Date()).getTime();
  if (Meteor.users.find().count() === 0) {
    adminId = Accounts.createUser({
      username: Meteor.settings.private.adminUserName,
      email: Meteor.settings.private.adminEmail,
      password: Meteor.settings.private.adminPassword,
      profile: {
        first_name: Meteor.settings.private.adminFirstName,
        last_name: Meteor.settings.private.adminLastName,
        company: Meteor.settings.private.adminCompany,
      },
      createdAt: new Date(timestamp),
    });
    Meteor.users.update({ _id: adminId }, { $set: { 'emails.0.verified': true } });
    Roles.addUsersToRoles(adminId, 'admin');
    timestamp += 1;
  }
  // ---------------------------------------------------------------------------
  // Timezones
  if (Timezones.find().count() === 0) {
    _.each(timezones, (timezone) => {
      Timezones.insert({
        value: timezone.value,
        abbr: timezone.abbr,
        offset: timezone.offset,
        isdst: timezone.isdst,
        text: timezone.text,
        utc: timezone.utc,
      });
    });
  }
  // ---------------------------------------------------------------------------
  // Cities
  if (Cities.find().count() === 0) {
    _.each(cities, (city) => {
      Cities.insert({
        name: city.name,
        country: city.country,
        altCountry: city.altCountry,
        muni: city.muni,
        muniSub: city.miniSub,
        featureClass: city.featureClass,
        featureCode: city.featureCode,
        adminCode: city.adminCode,
        population: city.population,
        lat: city.lat,
        lon: city.lon,
      });
    });
  }
  // ---------------------------------------------------------------------------
  // Currencies
  // LIIT: have a look on https://www.eventedmind.com/items/meteor-what-is-meteor-bindenvironment
  // to get more info about bindEnvironment
  if (Currencies.find().count() === 0) {
    currencies.update(
      Meteor.bindEnvironment((err, newCurrencies) => {
        _.each(newCurrencies, (currency, key) => {
          Currencies.insert({
            code: key,
            name: currency.name,
            rate: currency.rate,
            symbol: currency.symbol,
          });
        });
      }, (error) => {
        throw error;
      }),
    );
  }
  // ---------------------------------------------------------------------------
  // Countries
  if (Countries.find().count() === 0) {
    _.each(countries.countries.all, (country) => {
      if (country.status === 'assigned') {
        Countries.insert({
          alpha2: country.alpha2,
          alpha3: country.alpha3,
          countryCallingCodes: country.countryCallingCodes,
          currencies: country.currencies,
          ioc: country.ioc,
          languages: country.languages,
          name: country.name,
          status: country.status,
        });
      }
    });
  }
  // ---------------------------------------------------------------------------
  // Customers
  if (Customers.find().count() === 0) {
    const data = [
      {
        country: 'FR',
        city: 'Lyon',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Ancien (4€)',
      }, {
        country: 'FR',
        city: 'Lyon',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Ancien (3€)',
      }, {
        country: 'FR',
        city: 'Lyon',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Ancien (2€)',
      }, {
        country: 'FR',
        city: 'Lyon',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Nouveau Contract',
      }, {
        country: 'FR',
        city: 'Bordeaux',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Ancien (4€)',
      }, {
        country: 'FR',
        city: 'Bordeaux',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Ancien (3€)',
      }, {
        country: 'FR',
        city: 'Bordeaux',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Ancien (2€)',
      }, {
        country: 'FR',
        city: 'Bordeaux',
        timezone: 'RDT',
        brand: 'Deliveroo',
        contract: 'Nouveau Contract',
      },
    ];
    data.forEach((customer) => {
      const countryCode = Countries.findOne({
        alpha2: customer.country,
      }, {
        fields: {
          _id: 1,
        },
      })._id;
      const cityCode = Cities.findOne({
        name: customer.city,
      }, {
        fields: {
          _id: 1,
        },
      })._id;
      const timezoneCode = Timezones.findOne({
        abbr: customer.timezone,
      }, {
        fields: {
          _id: 1,
        },
      })._id;
      Customers.insert({
        country: countryCode,
        city: cityCode,
        timezone: timezoneCode,
        brand: customer.brand,
        contract: customer.contract,
        createdAt: new Date(timestamp),
      });
      timestamp += 1;
    });
  }
});
