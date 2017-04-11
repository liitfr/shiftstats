import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Currencies } from '../currencies.js';

Meteor.publish('currencies.list', function currenciesList() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Currencies.find({}, { fields:
      Currencies.publicFields,
    });
  }
  this.stop();
  return this.ready();
});
