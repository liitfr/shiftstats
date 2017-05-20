import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';

import { Customers } from '../customers/customers.js';
import { Shifts } from '../shifts/shifts.js';

const Users = {};

//----------------------------------------------------------------------------
// Fields
//----------------------------------------------------------------------------

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

// TODO : rename months & customers to something less generic, more verbose

//----------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------

Meteor.users.helpers({
  getShifts() {
    if (this._id === this.userId || Roles.userIsInRole(this.userId, 'admin')) {
      return Shifts.find({
        courier: this._id,
      }, {});
    }
    return undefined;
  },
});

//----------------------------------------------------------------------------
// Hooks
//----------------------------------------------------------------------------

Meteor.users.after.update((userId, doc, fieldNames, modifier) => {
  // LIIT : don't forget it'll still be visible by clients
  if (Meteor.isServer && _.indexOf(fieldNames, 'customers') !== -1) {
    _.each(modifier.$inc, (counterInc, id) => {
      const field = id.split('.')[0];
      if (field === 'customers') {
        const custId = id.split('.')[1];
        const newCounter = doc.customers[custId];
        const oldCounter = newCounter - counterInc;
        const incCustomer = {
          shiftsCounter: counterInc,
        };
        if (newCounter >= 1 && oldCounter <= 0) {
          incCustomer.couriersCounter = 1;
        } else if (newCounter <= 0 && oldCounter >= 1) {
          incCustomer.couriersCounter = -1;
        }
        Customers.direct.update({
          _id: custId,
        }, {
          $inc: incCustomer,
        });
      }
    });
  }
});

Meteor.users.after.remove((userId, doc) => {
  // LIIT : don't forget it'll still be visible by clients
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
