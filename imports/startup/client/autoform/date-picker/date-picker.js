import { AutoForm } from 'meteor/aldeed:autoform';
import { moment } from 'meteor/momentjs:moment';

// TODO: support i18n

AutoForm.addInputType('datepicker', {
  template: 'afInputDatePicker',
  valueIn: function valueIn(val) {
    return (val instanceof Date) ? moment.utc(val).format('DD/MM/YYYY') : val;
  },
  valueOut: function valueOut() {
    const val = this.val();
    const m = moment(val, 'DD/MM/YYYY', true);
    if (m && m.isValid()) {
      return new Date(m.get('year'), m.get('month'), m.get('date'));
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
