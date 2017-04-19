import { _ } from 'meteor/underscore';

import { Customers } from '../customers/customers.js';
import { Shifts } from '../shifts/shifts.js';

const Users = {};

// TODO : helpers my shifts

Users.adminFields = {
  _id: 1,
  username: 1,
  emails: 1,
  'services.facebook.email': 1,
  'services.facebook.name': 1,
  roles: 1,
  shiftsCounter: 1,
  delivsCounter: 1,
  kmsCounter: 1,
  gainsCounter: 1,
  months: 1,
  customers: 1,
  createdAt: 1,
  updatedAt: 1,
};

Meteor.users.after.update((userId, doc, fieldsNames, modifier) => {
  if (Meteor.isServer && fieldsNames.customers) {
    _.each(modifier.$inc.customers, (counterInc, id) => {
      const newCounter = doc.customers[id];
      const oldCounter = newCounter - counterInc;
      const incCustomer = {
        shiftsCounter: -counterInc,
      };
      if (newCounter >= 1 && oldCounter <= 0) {
        incCustomer.couriersCounter = 1;
      } else if (newCounter <= 0 && oldCounter >= 1) {
        incCustomer.couriersCounter = -1;
      }
      Customers.update({
        _id: id,
      }, {
        $inc: incCustomer,
      });
    });
  }
});

Meteor.users.after.remove((userId, doc) => {
  if (Meteor.isServer) {
    Shifts.direct.remove({
      courier: doc._id,
    });
    _.each(doc.customers, (counter, id) => {
      Customers.update({
        _id: id,
      }, {
        $inc: {
          shiftsCounter: -counter,
          couriersCounter: -1,
        },
      });
    });
  }
});

export default Users;
