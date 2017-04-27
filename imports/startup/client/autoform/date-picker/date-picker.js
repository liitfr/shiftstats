import { AutoForm } from 'meteor/aldeed:autoform';
import { moment } from 'meteor/momentjs:moment';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.addInputType('datepicker', {
  template: 'afInputDatePicker',
  valueIn: function valueIn(val) {
    return Number.isInteger(val) ? moment(val.toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase()) : val;
  },
  valueOut: function valueOut() {
    const picker = this.pickadate('picker');
    const item = picker && picker.get('select');
    const value = item && item.obj;
    const m = moment(value, TAPi18n.__('components.pickadate.format').toUpperCase(), true);
    if (m && m.isValid()) {
      return (m.get('year') * 10000) + ((m.get('month') + 1) * 100) + m.get('date');
    }
    return undefined;
  },
});

Template.afInputDatePicker.onRendered(() => {
  const instance = Template.instance();
  instance.autorun(() => {
    const input = instance.$('input').pickadate({
      container: 'main',
      selectMonths: true,
      selectYears: 2,
      format: TAPi18n.__('components.pickadate.format'),
      closeOnSelect: true,
      closeOnClear: true,
      // TODO : isn't generic ....
      max: new Date(),
      onSet(ele) {
        if (ele.select) {
          this.close();
        }
      },
    });
    const picker = input.pickadate('picker');
    picker.component.settings.monthsFull = _.map(TAPi18n.__('components.pickadate.monthsFull', { returnObjectTrees: true }), month => month);
    picker.component.settings.monthsShort = _.map(TAPi18n.__('components.pickadate.monthsShort', { returnObjectTrees: true }), month => month);
    picker.component.settings.weekdaysFull = _.map(TAPi18n.__('components.pickadate.weekdaysFull', { returnObjectTrees: true }), weekday => weekday);
    picker.component.settings.weekdaysShort = _.map(TAPi18n.__('components.pickadate.weekdaysShort', { returnObjectTrees: true }), weekday => weekday);
    picker.component.settings.today = TAPi18n.__('components.pickadate.today');
    picker.component.settings.clear = TAPi18n.__('components.pickadate.clear');
    picker.component.settings.close = TAPi18n.__('components.pickadate.close');
    picker.component.settings.firstDay = TAPi18n.__('components.pickadate.firstDay');
    picker.component.settings.format = TAPi18n.__('components.pickadate.format');
    picker.component.settings.labelMonthNext = TAPi18n.__('components.pickadate.labelMonthNext');
    picker.component.settings.labelMonthPrev = TAPi18n.__('components.pickadate.labelMonthPrev');
    picker.component.settings.labelMonthSelect = TAPi18n.__('components.pickadate.labelMonthSelect');
    picker.component.settings.labelYearSelect = TAPi18n.__('components.pickadate.labelYearSelect');
    picker.render();
  });
});
