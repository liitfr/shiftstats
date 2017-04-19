import { Meteor } from 'meteor/meteor';
// import { publishComposite } from 'meteor/reywood:publish-composite';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
// import { Roles } from 'meteor/alanning:roles';

import { Shifts } from '../shifts.js';
// import { Users } from '../../users/users.js';

Meteor.publish('shifts.mine', function shiftsMine() {
  if (this.userId) {
    ReactiveAggregate(this, Shifts, [{
      $match: {
        courier: this.userId,
      },
    }, {
      $group: {
        _id: { $concat: ['$courier', '$customer', '$monthString'] },
        customer: {
          $first: '$customerLabel',
        },
        currency: {
          $first: '$currencySymbol',
        },
        shifts: {
          $push: {
            _id: '$_id',
            date: '$date',
            startHour: '$startHour',
            endHour: '$endHour',
            nbDelivs: '$nbDelivs',
            nbKms: '$nbKms',
            gains: '$gains',
          },
        },
        duration: {
          $sum: '$duration',
        },
        nbDelivs: {
          $sum: '$nbDelivs',
        },
        nbKms: {
          $sum: '$nbKms',
        },
        gains: {
          $sum: '$gains',
        },
      },
    }, {
      $sort: {
        month: -1,
        customerLabel: 1,

      },
    // }, {
      // $project: {
      //   // courier: '$_id.courier',
      //   // customerLabel: '$_id.customerLabel',
      //   // month: '$_id.month',
      //   _id: '$_id',
      //   // shifts: '$shifts',
      //   // nbDelivs: '$nbDelivs',
      //   // nbKms: '$nbKms',
      //   gains: '$gains',
      // },
    }]);
  }
  // this.stop();
  // return this.ready();
});

// publishComposite('shifts.admin', function shiftsAdmin() {
//   if (Roles.userIsInRole(this.userId, 'admin')) {
//     return {
//       find() {
//         return Shifts.find({}, {
//           fields: Shifts.adminFields,
//         });
//       },
//       children: [{
//         collectionName: 'usersOfShifts',
//         find(shift) {
//           return Meteor.users.find({
//             _id: shift.courier,
//           }, {
//             fields: Users.adminFields,
//             limit: 1,
//           });
//         },
//       }],
//     };
//   }
//   this.stop();
//   return this.ready();
// });

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
