import { SessionAmplify } from 'meteor/mrt:session-amplify';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Customers } from '../../../api/customers/customers.js';

import './chart-controls.html';

// TODO : loaders when subscription ready !
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
  // TODO : update favorite city
  'change #select-city': function changeSelectCity(event) {
    SessionAmplify.set('shiftstats-user-favorite-city', $(event.target).val());
  },
});
