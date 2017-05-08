import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

import { Shifts } from '../shifts.js';

Meteor.publish('shifts.mine', function shiftsMine(monthString) {
  check(monthString, String);
  if (this.userId) {
    ReactiveAggregate(this, Shifts, [{
      $match: {
        courier: this.userId,
        monthString,
      },
    }, {
      $sort: {
        month: -1,
        customerLabel: -1,
        date: -1,
        endHour: -1,
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
    }], { clientCollection: 'shiftsMine' });
    return undefined;
  }
  this.stop();
  return this.ready();
});

Meteor.publish('shifts.analytics.nbParticipants', function shiftsAnalyticsNbParticipants(city, startDate, endDate) {
  check(city, String);
  check(startDate, Match.Integer);
  check(endDate, Match.Integer);
  if (this.userId) {
    ReactiveAggregate(this, Shifts, [{
      $match: {
        city,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    }, {
      $group: {
        _id: '$courier',
      },
    }, {
      $group: {
        _id: Random.id(),
        counter: { $sum: 1 },
      },
    }], { clientCollection: 'statsNbParticipants' });
    return undefined;
  }
  this.stop();
  return this.ready();
});

Meteor.publish('shifts.analytics.compare', function shiftsAnalyticsCompare(city, startDate, endDate) {
  check(city, String);
  check(startDate, Match.Integer);
  check(endDate, Match.Integer);
  if (this.userId) {
    ReactiveAggregate(this, Shifts, [{
      $match: {
        city,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    }, {
      $sort: {
        dayOfTheWeek: 1,
        brand: 1,
        contract: 1,
      },
    }, {
      $group: {
        _id: { $concat: ['$brand', '$contract', '$dayOfTheWeekString'] },
        customer: {
          $first: '$customer',
        },
        brand: {
          $first: '$brand',
        },
        contract: {
          $first: '$contract',
        },
        color: {
          $first: '$color',
        },
        dayOfTheWeek: {
          $first: '$dayOfTheWeek',
        },
        counter: {
          $sum: '$counter',
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
        duration: {
          $sum: '$duration',
        },
        counterMorning: {
          $sum: '$counterMorning',
        },
        nbDelivsMorning: {
          $sum: '$nbDelivsMorning',
        },
        nbKmsMorning: {
          $sum: '$nbKmsMorning',
        },
        gainsMorning: {
          $sum: '$gainsMorning',
        },
        durationMorning: {
          $sum: '$durationMorning',
        },
        counterLunch: {
          $sum: '$counterLunch',
        },
        nbDelivsLunch: {
          $sum: '$nbDelivsLunch',
        },
        nbKmsLunch: {
          $sum: '$nbKmsLunch',
        },
        gainsLunch: {
          $sum: '$gainsLunch',
        },
        durationLunch: {
          $sum: '$durationLunch',
        },
        counterAfternoon: {
          $sum: '$counterAfternoon',
        },
        nbDelivsAfternoon: {
          $sum: '$nbDelivsAfternoon',
        },
        nbKmsAfternoon: {
          $sum: '$nbKmsAfternoon',
        },
        gainsAfternoon: {
          $sum: '$gainsAfternoon',
        },
        durationAfternoon: {
          $sum: '$durationAfternoon',
        },
        counterDinner: {
          $sum: '$counterDinner',
        },
        nbDelivsDinner: {
          $sum: '$nbDelivsDinner',
        },
        nbKmsDinner: {
          $sum: '$nbKmsDinner',
        },
        gainsDinner: {
          $sum: '$gainsDinner',
        },
        durationDinner: {
          $sum: '$durationDinner',
        },
        counterNight: {
          $sum: '$counterNight',
        },
        nbDelivsNight: {
          $sum: '$nbDelivsNight',
        },
        nbKmsNight: {
          $sum: '$nbKmsNight',
        },
        gainsNight: {
          $sum: '$gainsNight',
        },
        durationNight: {
          $sum: '$durationNight',
        },
      },
    }], { clientCollection: 'statsCompare' });
    return undefined;
  }
  this.stop();
  return this.ready();
});

Meteor.publish('shifts.analytics.evol', function shiftsAnalyticsEvol(city, startDate, endDate) {
  check(city, String);
  check(startDate, Match.Integer);
  check(endDate, Match.Integer);
  if (this.userId) {
    ReactiveAggregate(this, Shifts, [{
      $match: {
        city,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    }, {
      $sort: {
        brand: 1,
        contract: 1,
        dateString: 1,
      },
    }, {
      $group: {
        _id: { $concat: ['$brand', '$contract', '$dateString'] },
        customer: {
          $first: '$customer',
        },
        brand: {
          $first: '$brand',
        },
        contract: {
          $first: '$contract',
        },
        color: {
          $first: '$color',
        },
        dateString: {
          $first: '$dateString',
        },
        counter: {
          $sum: '$counter',
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
        duration: {
          $sum: '$duration',
        },
        counterMorning: {
          $sum: '$counterMorning',
        },
        nbDelivsMorning: {
          $sum: '$nbDelivsMorning',
        },
        nbKmsMorning: {
          $sum: '$nbKmsMorning',
        },
        gainsMorning: {
          $sum: '$gainsMorning',
        },
        durationMorning: {
          $sum: '$durationMorning',
        },
        counterLunch: {
          $sum: '$counterLunch',
        },
        nbDelivsLunch: {
          $sum: '$nbDelivsLunch',
        },
        nbKmsLunch: {
          $sum: '$nbKmsLunch',
        },
        gainsLunch: {
          $sum: '$gainsLunch',
        },
        durationLunch: {
          $sum: '$durationLunch',
        },
        counterAfternoon: {
          $sum: '$counterAfternoon',
        },
        nbDelivsAfternoon: {
          $sum: '$nbDelivsAfternoon',
        },
        nbKmsAfternoon: {
          $sum: '$nbKmsAfternoon',
        },
        gainsAfternoon: {
          $sum: '$gainsAfternoon',
        },
        durationAfternoon: {
          $sum: '$durationAfternoon',
        },
        counterDinner: {
          $sum: '$counterDinner',
        },
        nbDelivsDinner: {
          $sum: '$nbDelivsDinner',
        },
        nbKmsDinner: {
          $sum: '$nbKmsDinner',
        },
        gainsDinner: {
          $sum: '$gainsDinner',
        },
        durationDinner: {
          $sum: '$durationDinner',
        },
        counterNight: {
          $sum: '$counterNight',
        },
        nbDelivsNight: {
          $sum: '$nbDelivsNight',
        },
        nbKmsNight: {
          $sum: '$nbKmsNight',
        },
        gainsNight: {
          $sum: '$gainsNight',
        },
        durationNight: {
          $sum: '$durationNight',
        },
      },
    }], { clientCollection: 'statsEvol' });
    return undefined;
  }
  this.stop();
  return this.ready();
});
