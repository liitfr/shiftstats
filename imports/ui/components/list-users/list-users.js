import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';

import './list-users.html';

Template.listUsers.onCreated(function listUsersOnCreated() {
  // LIIT : seems like we don't need autorun ?!
  this.subscribe('users.admin');
});

Template.listUsers.helpers({
  users() {
    return Meteor.users.find({}, { sort: { createdAt: -1 } });
  },
});

// -----------------------------------------------------------------------------

// TODO : moment depends on i18n
Template.usersItem.helpers({
  formatedCreatedAt() {
    return moment(this.user.createdAt).format('L');
  },
});

// TODO : Warning modal
Template.usersItem.events({
  'click .btn-delete-user': function eventDeletePricing() {
    Meteor.users.remove(this.user._id);
  },
});
