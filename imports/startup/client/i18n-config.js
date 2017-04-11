import { moment } from 'meteor/momentjs:moment';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { TAPi18n } from 'meteor/tap:i18n';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { Tracker } from 'meteor/tracker';

import { CustomersSchema } from '../../api/customers/customers.js';
import { ShiftsSchema } from '../../api/shifts/shifts.js';

Meteor.startup(() => {
  if (SessionAmplify.get('shiftstats-user-language') === undefined) {
    SessionAmplify.set('shiftstats-user-language', Meteor.settings.public.defaultLanguage);
  }

  Tracker.autorun(() => {
    const storedLanguage = SessionAmplify.get('shiftstats-user-language');
    TAPi18n.setLanguage(storedLanguage);
    moment.locale(storedLanguage);
    T9n.setLanguage(storedLanguage);
    CustomersSchema.messageBox.setLanguage(storedLanguage);
    ShiftsSchema.messageBox.setLanguage(storedLanguage);
    Tracker.afterFlush(() => {
      $('select').material_select();
    });
  });
});
