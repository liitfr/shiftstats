import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import 'materialize-css';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

import '../../components/loader/loader.js';
import '../../components/nav/nav.js';
import '../../components/footer/footer.js';

import './body.html';

// TODO : use momentum + hammerjs

const showConnectionIssueRV = new ReactiveVar(false);
Meteor.startup(() => {
  setTimeout(() => {
    showConnectionIssueRV.set(true);
  }, Meteor.settings.public.connectionIssueTimeout);
});

Template.appBody.onRendered(() => {
  Tracker.autorun(() => {
    const routeName = FlowRouter.getRouteName();
    DocHead.removeDocHeadAddedTags();
    DocHead.setTitle(TAPi18n.__(`meta.${routeName}.title`));
    DocHead.addMeta({ name: 'description', content: TAPi18n.__(`meta.${routeName}.description`) });
  });
});

Template.appBody.helpers({
  appName() {
    return Meteor.settings.public.appName;
  },
  connected() {
    if (showConnectionIssueRV.get()) {
      return Meteor.status().connected;
    }
    return true;
  },
});
