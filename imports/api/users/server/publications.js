import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import Users from '../users.js';

Meteor.publish('users.admin', function usersAdmin() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({}, {
      fields: Users.adminFields,
    });
  }
  this.stop();
  return this.ready();
});

Meteor.publish('users.me', function usersMe() {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId,
    }, {
      fields: Users.adminFields,
    });
  }
  this.stop();
  return this.ready();
});
