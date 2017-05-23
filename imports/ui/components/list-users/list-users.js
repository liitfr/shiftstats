/* global Materialize */

import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import '../loader/loader.js';
import './list-users.html';

Template.listUsers.onCreated(function listUsersOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('users.admin');
  });
});

// -----------------------------------------------------------------------------

Template.usersList.onCreated(function usersListOnCreated() {
  this.userToDeleteRV = new ReactiveVar();
});

Template.usersList.onRendered(function usersListOnRendered() {
  this.$('.modal').modal();
});

Template.usersList.helpers({
  users() {
    return Meteor.users.find({}, { sort: { createdAt: -1 } });
  },
  userToDeleteRV() {
    return Template.instance().userToDeleteRV;
  },
});

Template.usersList.events({
  'click #delete-for-real': function clickDeleteForReal() {
    Meteor.users.remove(Template.instance().userToDeleteRV.get(), (err) => {
      Materialize.toast(err || TAPi18n.__('crudActions.users.remove'), Meteor.settings.public.toastDuration);
    });
  },
});

// -----------------------------------------------------------------------------
Template.usersItem.helpers({
  formatedCreatedAt() {
    return moment(this.user.createdAt).format(TAPi18n.__('components.pickadate.format').toUpperCase());
  },
  isNotAdmin() {
    return this.user.roles === undefined || this.user.roles[0] !== 'admin';
  },
});

Template.usersItem.events({
  'click .btn-delete-user': function clickBtnDeleteUser() {
    this.userToDeleteRV.set(this.user._id);
  },
});
