import { BrowserPolicy } from 'meteor/browser-policy';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');
  BrowserPolicy.content.allowDataUrlForAll('fonts.gstatic.com');
  BrowserPolicy.content.allowEval();
});
