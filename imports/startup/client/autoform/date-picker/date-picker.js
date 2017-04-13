import { AutoForm } from 'meteor/aldeed:autoform';
import { moment } from 'meteor/momentjs:moment';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.addInputType('datepicker', {
  template: 'afInputDatePicker',
  valueIn: function valueIn(val) {
    return Number.isInteger(val) ? moment(val.toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase()) : val;
  },
  valueOut: function valueOut() {
    const val = this.val();
    const m = moment(val, TAPi18n.__('components.pickadate.format').toUpperCase(), true);
    if (m && m.isValid()) {
      return (m.get('year') * 10000) + ((m.get('month') + 1) * 100) + m.get('date');
    }
    return null;
  },
  valueConverters: {
    string: AutoForm.valueConverters.dateToDateStringUTC,
    stringArray: AutoForm.valueConverters.dateToDateStringUTCArray,
    number: AutoForm.valueConverters.dateToNumber,
    numberArray: AutoForm.valueConverters.dateToNumberArray,
    dateArray: AutoForm.valueConverters.dateToDateArray,
  },
  contextAdjust(ctx) {
    const context = ctx;
    if (typeof context.atts.max === 'undefined' && context.max instanceof Date) {
      context.atts.max = AutoForm.valueConverters.dateToDateStringUTC(context.max);
    }
    if (typeof context.atts.min === 'undefined' && context.min instanceof Date) {
      context.atts.min = AutoForm.valueConverters.dateToDateStringUTC(context.min);
    }
    return context;
  },
});
