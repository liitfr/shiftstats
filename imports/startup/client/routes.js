import { AccountsTemplates } from 'meteor/useraccounts:core';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/new-shift/new-shift.js';
import '../../ui/pages/my-shifts/my-shifts.js';
import '../../ui/pages/stats/stats.js';
import '../../ui/pages/presentation/presentation.js';
import '../../ui/pages/admin-customers/admin-customers.js';
import '../../ui/pages/admin-users/admin-users.js';
import '../../ui/pages/admin-shifts/admin-shifts.js';
import '../../ui/pages/not-found/not-found.js';

FlowRouter.route('/', {
  triggersEnter: [(context, redirect) => {
    redirect('/home');
  }],
});

FlowRouter.route('/home', {
  name: 'App.home',
  action() {
    BlazeLayout.render('appBody', { main: 'appHome' });
  },
});

FlowRouter.route('/new-shift', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.newShift',
  action() {
    BlazeLayout.render('appBody', { main: 'appNewShift' });
  },
});

FlowRouter.route('/my-shifts', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.myShifts',
  action() {
    BlazeLayout.render('appBody', { main: 'appMyShifts' });
  },
});

FlowRouter.route('/stats', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.stats',
  action() {
    BlazeLayout.render('appBody', { main: 'appStats' });
  },
});

FlowRouter.route('/presentation', {
  name: 'App.presentation',
  action() {
    BlazeLayout.render('appBody', { main: 'appPresentation' });
  },
});

FlowRouter.route('/admin-customers', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.adminCustomers',
  action() {
    BlazeLayout.render('appBody', { main: 'appAdminCustomers' });
  },
});

FlowRouter.route('/admin-shifts', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.adminShifts',
  action() {
    BlazeLayout.render('appBody', { main: 'appAdminShifts' });
  },
});

FlowRouter.route('/admin-users', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.adminUsers',
  action() {
    BlazeLayout.render('appBody', { main: 'appAdminUsers' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('appBody', { main: 'appNotFound' });
  },
};

// BUG : Style isn't applied on reset password page, check that problem
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
