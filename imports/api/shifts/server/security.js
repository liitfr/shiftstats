import { Security } from 'meteor/ongoworks:security';
import { Shifts } from '../shifts.js';

Security.defineMethod('ownsDocument', {
  fetch: [],
  allow(type, field, userId, doc) {
    return userId === doc[!field ? 'userId' : field];
  },
});

Shifts.permit(['insert', 'update', 'remove']).ifHasRole('admin').allowInClientCode();
Shifts.permit(['insert', 'update', 'remove']).ifLoggedIn().ownsDocument('courier').allowInClientCode();
