import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Customers } from '../customers.js';

Meteor.publish('customers.admin', function customersAdmin() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Customers.find({}, { fields:
      Customers.adminFields,
    });
  }
  this.stop();
  return this.ready();
});

Meteor.publish('customers.list', function customersList() {
  if (this.userId) {
    return Customers.find({}, { fields:
      Customers.publicFields,
    });
  }
  this.stop();
  return this.ready();
});
