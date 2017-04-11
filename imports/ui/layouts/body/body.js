import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

import '../../components/nav/nav.js';
import '../../components/footer/footer.js';

import './body.html';

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
});
