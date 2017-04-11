Accounts.emailTemplates.appName = Meteor.settings.public.appName;
Accounts.emailTemplates.from = `${Meteor.settings.public.appName} ${Meteor.settings.private.mailgunNoReplyMail}`;
Accounts.emailTemplates.resetPassword.subject = () => 'Créer un nouveau mot de passe';
Accounts.emailTemplates.resetPassword.text = (user, url) => `Salut coursier,\n\nSuis ce lien afin de créer un nouveau mot de passe:\n${url}\n\nRide safe,\nL'équipe ${Meteor.settings.public.appName}`;

Accounts.onCreateUser((options, user) => {
  const myUser = user;
  myUser.shiftsCounter = 0;
  myUser.delivsCounter = 0;
  myUser.kmsCounter = 0;
  myUser.gainsCounter = 0;
  return myUser;
});

// TODO : mail for english user
// BUG : accounts UI pages title & description doesn't work !
// BUG : account UI when redefine password isn't materialized but bootstrap ...

// TODO : Denormalized number of shifts for the user ?
// Accounts.onCreateUser((options, user) => {
//   user.nbShifts = 0;
//   return user;
// });
