import { AutoForm } from 'meteor/aldeed:autoform';
import 'materialize-clockpicker/src/js/materialize.clockpicker.js';

AutoForm.addInputType('timepicker', {
  template: 'afInputTimePicker',
  valueIn: function valueIn(val) {
    return val;
  },
  valueOut: function valueOut() {
    return this.val();
  },
});

Template.afInputTimePicker.onRendered(() => {
  const instance = Template.instance();
  instance.autorun(() => {
    instance.$('.timepicker').pickatime({
      autoclose: true,
      twelvehour: false,
      default: '',
      donetext: 'OK',
    });
  });
});
