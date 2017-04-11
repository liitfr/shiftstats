import { AutoForm } from 'meteor/aldeed:autoform';
import { Materialize } from 'meteor/materialize:materialize';
import { TAPi18n } from 'meteor/tap:i18n';

import './date-picker/date-picker.html';
import './date-picker/date-picker.js';

Template.autoForm.onRendered(function autoFormOnRendered() {
  this.$('select').material_select();
});

AutoForm.addHooks(null, {
  onSuccess(formType) {
    const collectionName = this.collection._name;
    Materialize.toast(TAPi18n.__(`crudActions.${collectionName}.${formType}`), Meteor.settings.public.toastDuration);
    this.template.$('select').material_select();
  },
});
