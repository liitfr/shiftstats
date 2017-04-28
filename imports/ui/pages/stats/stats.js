import '../../components/chart-controls/chart-controls.js';
import '../../components/chart-evol/chart-evol.js';
import '../../components/chart-compare/chart-compare.js';

import './stats.html';

Template.appStats.onCreated(function appStatsOnCreated() {
  this.chartTypeRV = new ReactiveVar('chartCompare');
});

Template.appStats.helpers({
  chartTypeRV() {
    return Template.instance().chartTypeRV;
  },
  chartType() {
    return Template.instance().chartTypeRV.get();
  },
});
