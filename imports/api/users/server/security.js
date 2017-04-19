import { Meteor } from 'meteor/meteor';
import { Security } from 'meteor/ongoworks:security';
import { _ } from 'meteor/underscore';

Security.defineMethod('ifIsCurrentUser', {
  fetch: [],
  transform: null,
  allow(type, arg, userId, doc) {
    return userId === doc._id;
  },
});

Security.defineMethod('ifAccountIsNotAdmin', {
  fetch: [],
  transform: null,
  allow(type, arg, userId, doc) {
    if (_.has(doc, 'roles') && doc.roles[0] === 'admin') {
      return false;
    }
    return true;
  },
});

Security.permit(['update']).collections([Meteor.users])
  .ifIsCurrentUser()
  .onlyProps(['shiftsCounter', 'delivsCounter', 'kmsCounter', 'gainsCounter', 'months', 'customers']);

// TODO : delete all his shifts
Security.permit(['remove']).collections([Meteor.users])
  .ifHasRole('admin')
  .ifAccountIsNotAdmin()
  .allowInClientCode();
