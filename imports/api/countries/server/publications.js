import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Countries } from '../countries.js';

Meteor.publish('countries.list', function countriesList() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Countries.find({}, { fields:
      Countries.publicFields,
    });
  }
  this.stop();
  return this.ready();
});
