import { Shifts } from '../../../api/shifts/shifts.js';

import './chart-compare.html';

// TODO : indacteurs de confiance

Template.chartCompare.onCreated(function chartCompareOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('shifts.analytics.compare', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
  });
});


Template.chartCompare.helpers({
  shifts() {
    return Shifts.find();
  },
});
