import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Timezones } from '../timezones.js';

Meteor.publish('timezones.list', function timezonesList() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Timezones.find({}, { fields:
      Timezones.publicFields,
    });
  }
  this.stop();
  return this.ready();
});
