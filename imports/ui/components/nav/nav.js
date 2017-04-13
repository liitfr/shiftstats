import { AccountsTemplates } from 'meteor/useraccounts:core';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

import '../nav-admin/nav-admin.js';

import './nav.html';

Template.nav.onRendered(function navOnRendered() {
  this.$('.button-collapse').sideNav({
    closeOnClick: true,
  });
  this.$('.dropdown-button').dropdown({ belowOrigin: true });
});

Template.nav.onDestroyed(function navOnDestroyed() {
  this.$('.button-collapse').sideNav('destroy');
});

Template.nav.helpers({
  navButtonText() {
    const key = Meteor.userId() ?
    AccountsTemplates.texts.navSignOut :
    AccountsTemplates.texts.navSignIn;
    const message = T9n.get(key, false);
    return message;
  },
});

Template.nav.events({
  'click .at-nav-button': function clickAtNavButton(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      AccountsTemplates.logout();
    } else {
      AccountsTemplates.linkClick('signIn');
    }
  },
  'click .language-fr': function clickLanguageFr(event) {
    event.preventDefault();
    SessionAmplify.set('shiftstats-user-language', 'fr');
  },
  'click .language-en': function clicklanguageEn(event) {
    event.preventDefault();
    SessionAmplify.set('shiftstats-user-language', 'en');
  },
});
