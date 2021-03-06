import { moment } from 'meteor/momentjs:moment';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Customers } from '../../../api/customers/customers.js';

import './chart-controls.html';

Template.chartControls.onCreated(function chartControlsOnCreated() {
  this.data.chartFiltersRD.setDefault({
    city: SessionAmplify.get('shiftstats-user-favorite-city'),
    history: 'rollingMonth',
    startDate: parseInt(moment().add(-31, 'd').format('YYYYMMDD'), 10),
    endDate: parseInt(moment().add(-1, 'd').format('YYYYMMDD'), 10),
    kpi: 'gainsperhour',
    period: 'dinner',
    'payroll-activated': false,
    'payroll-percentage': 25,
  });
});

Template.chartControls.onRendered(function chartControlsOnRendered() {
  const template = this;
  template.autorun(() => {
    template.subscribe('customers.list', () => {
      Tracker.afterFlush(() => {
        template.$('select').material_select();
      });
    });
  });
});

Template.chartControls.onDestroyed(function chartControlsOnDestroyed() {
  this.$('select').material_select('destroy');
});

Template.chartControls.helpers({
  cities() {
    Tracker.afterFlush(() => {
      $('select[name$="city"]').material_select();
    });
    const cities = Customers.find({}, {
      fields: {
        city: 1,
        cityName: 1,
      },
      sort: {
        cityName: 1,
      },
    }).fetch();
    return _.map(_.uniq(cities, true, city => city.cityName), city => ({
      value: city.city,
      label: city.cityName,
      isSelected: city.city === SessionAmplify.get('shiftstats-user-favorite-city'),
    }));
  },
});

Template.chartControls.events({
  'click #show-chart-compare': function clickShowChartCompare(event, templateInstance) {
    templateInstance.data.chartTypeRV.set('chartCompare');
  },
  'click #show-chart-evol': function clickShowChartEvol(event, templateInstance) {
    templateInstance.data.chartTypeRV.set('chartEvol');
  },
  'change .select-city': function changeSelectCity(event, templateInstance) {
    templateInstance.data.chartFiltersRD.set('city', $(event.target).val());
    SessionAmplify.set('shiftstats-user-favorite-city', $(event.target).val());
  },
  'change .select-history': function changeSelectHistory(event, templateInstance) {
    templateInstance.data.chartFiltersRD.set('history', $(event.target).val());
    switch ($(event.target).val()) {
      case 'rollingMonth':
        templateInstance.data.chartFiltersRD.set('startDate', parseInt(moment().add(-31, 'd').format('YYYYMMDD'), 10));
        templateInstance.data.chartFiltersRD.set('endDate', parseInt(moment().add(-1, 'd').format('YYYYMMDD'), 10));
        break;
      case 'lastWeek':
        templateInstance.data.chartFiltersRD.set('startDate', parseInt(moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYYMMDD'), 10));
        templateInstance.data.chartFiltersRD.set('endDate', parseInt(moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYYMMDD'), 10));
        break;
      default:
        throw new Error('Non supported use case');
    }
  },
  'change .radio-kpi': function changeRadioKpi(event, templateInstance) {
    templateInstance.data.chartFiltersRD.set('kpi', $(event.target).val());
  },
  'change .radio-period': function changeRadioPeriod(event, templateInstance) {
    templateInstance.data.chartFiltersRD.set('period', $(event.target).val());
  },
  'change .switch-payroll': function changeSwitchPayroll(event, templateInstance) {
    templateInstance.data.chartFiltersRD.set('payroll-activated', $(event.target).is(':checked'));
  },
  'change .range-payroll': function changeRangePayroll(event, templateInstance) {
    templateInstance.data.chartFiltersRD.set('payroll-percentage', $(event.target).val());
  },
});
