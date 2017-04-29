import { moment } from 'meteor/momentjs:moment';
import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Customers } from '../../../api/customers/customers.js';

import './chart-controls.html';

// TODO : loaders when subscription ready !
// TODO : should we import { $ } wherever it is used ?
// TODO : historique ? toujours, année, mois, semaine s-1, semaine courante, ... ?

Template.chartControls.onCreated(function chartControlsOnCreated() {
  // TODO : we should manage default values in one single place
  // (today it's defined both in chart-controls.js & chart-controls.html)
  this.data.chartFiltersRD.set('city', SessionAmplify.get('shiftstats-user-favorite-city'));
  this.data.chartFiltersRD.set('history', 'rollingMonth');
  this.data.chartFiltersRD.set('startDate', parseInt(moment().add(-31, 'd').format('YYYYMMDD'), 10));
  this.data.chartFiltersRD.set('endDate', parseInt(moment().add(-1, 'd').format('YYYYMMDD'), 10));
  this.data.chartFiltersRD.set('kpi', 'gainsperhour');
  this.data.chartFiltersRD.set('period', 'dinner');
  this.data.chartFiltersRD.set('payroll-activated', false);
  this.data.chartFiltersRD.set('payroll-percentage', 25);
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
    if ($(event.target).val() === 'rollingMonth') {
      this.data.chartFiltersRD.set('startDate', parseInt(moment().add(-31, 'd').format('YYYYMMDD'), 10));
      this.data.chartFiltersRD.set('endDate', parseInt(moment().add(-1, 'd').format('YYYYMMDD'), 10));
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
