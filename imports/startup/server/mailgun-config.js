import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.startup(() => {
  Meteor.Mailgun.config({
    username: Meteor.settings.private.mailgunUsername,
    password: Meteor.settings.private.mailgunPassword,
  });
});

// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: (mailFields) => {
    check(mailFields, Object);
    check([
      mailFields.to,
      mailFields.from,
      mailFields.subject,
      mailFields.text,
      mailFields.html,
    ], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Meteor.Mailgun.send({
      to: mailFields.to,
      from: mailFields.from,
      subject: mailFields.subject,
      text: mailFields.text,
      html: mailFields.html,
    });
  },
});
