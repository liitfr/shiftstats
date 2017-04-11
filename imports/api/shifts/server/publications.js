import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { Roles } from 'meteor/alanning:roles';

import { Shifts } from '../shifts.js';
import { Users } from '../../users/users.js';

Meteor.publish('shifts.mine', function shiftsMine() {
  if (this.userId) {
    return Shifts.find({
      courier: this.userId,
    }, { fields:
      Shifts.userFields,
    });
  }
  this.stop();
  return this.ready();
});

publishComposite('shifts.admin', function shiftsAdmin() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return {
      find() {
        return Shifts.find({}, {
          fields: Shifts.adminFields,
        });
      },
      children: [{
        collectionName: 'usersOfShifts',
        find(shift) {
          return Meteor.users.find({
            _id: shift.courier,
          }, {
            fields: Users.adminFields,
            limit: 1,
          });
        },
      }],
    };
  }
  this.stop();
  return this.ready();
});

// Meteor.publish('shifts.analytics', function shiftsAnalytics() {
//   ReactiveAggregate(this, Shifts, [{
//     $group: {
//       _id: this.userId,
//       hours: {
//         $sum: '$hours',
//       },
//       books: {
//         $sum: 'books',
//       },
//     },
//   }, {
//     $project: {
//       hours: '$hours',
//       books: '$books',
//     },
//   }], { clientCollection: 'shiftReport' });
// });
