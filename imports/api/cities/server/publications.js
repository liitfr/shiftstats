import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Cities } from '../cities.js';

Meteor.publish('cities.listBigCities', function citiesListBigCities() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Cities.find({
      population: { $gte: 100000 },
    }, { fields:
      Cities.publicFields,
    });
  }
  this.stop();
  return this.ready();
});
