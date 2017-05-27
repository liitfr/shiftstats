import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.remove({
  service: 'facebook',
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: Meteor.settings.private.serviceFbAppId,
  secret: Meteor.settings.private.serviceFbSecret,
});
