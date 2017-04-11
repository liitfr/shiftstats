import './nav-admin.html';

// LIIT : http://stackoverflow.com/questions/29815310/materialize-dropdown-in-if-statement-doesnt-work
Template.navAdmin.onRendered(function () {
  this.$('.dropdown-button').dropdown({ belowOrigin: true });
});
