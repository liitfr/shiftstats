import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import d3Extended from 'd3-extended';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import { Customers } from '../../../api/customers/customers.js';
import { StatsEvol, StatsNbParticipants } from '../../../api/client-collections.js';

import '../loader/loader.js';
import './chart-evol.html';

Template.chartEvol.onCreated(function chartEvolOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('shifts.analytics.evol', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
    template.subscribe('shifts.analytics.nbParticipants', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
  });
});

// -----------------------------------------------------------------------------

Template.evolChart.onCreated(function evolChartOnCreated() {
  const template = this;
  template.dataAvailableRV = new ReactiveVar(false);
  template.shiftsDataRV = new ReactiveVar();
});

Template.evolChart.onRendered(function evolChartOnRendered() {
  const template = this;
  template.autorun(() => {
    template.shiftsDataRV.set(StatsEvol.find({}, {
      sort: {
        brand: 1,
        contract: 1,
        dateString: 1,
      },
    }).fetch());
    if (_.isEmpty(template.shiftsDataRV.get()) || Math.max.apply(null, _.pluck(template.shiftsDataRV.get(), `counter${this.data.chartFiltersRD.get('period').charAt(0).toUpperCase()}${this.data.chartFiltersRD.get('period').slice(1)}`)) < 1) {
      template.dataAvailableRV.set(false);
    } else {
      template.dataAvailableRV.set(true);
    }
  });
});

Template.evolChart.helpers({
  dataAvailableRV() {
    return Template.instance().dataAvailableRV;
  },
  dataAvailable() {
    return Template.instance().dataAvailableRV.get();
  },
  shiftsData() {
    return Template.instance().shiftsDataRV.get();
  },
  details() {
    let nbParticipants = StatsNbParticipants.findOne();
    if (nbParticipants) {
      nbParticipants = nbParticipants.counter;
    } else {
      nbParticipants = 0;
    }
    return `${TAPi18n.__('components.chartEvol.periodFrom')} ${moment(this.chartFiltersRD.get('startDate').toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase())} ${TAPi18n.__('components.chartEvol.periodTo')} ${moment(this.chartFiltersRD.get('endDate').toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase())} : ${nbParticipants} ${TAPi18n.__('components.chartEvol.participants')}`;
  },
});

// -----------------------------------------------------------------------------
