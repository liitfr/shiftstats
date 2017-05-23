import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import d3Extended from 'd3-extended';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import { computeData } from '../../../utils/stats-computation.js';
import { Customers } from '../../../api/customers/customers.js';
import { StatsCompare, StatsNbParticipants } from '../../../api/client-collections.js';

import '../loader/loader.js';
import './chart-compare.html';

Template.chartCompare.onCreated(function chartCompareOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('shifts.analytics.compare', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
    template.subscribe('shifts.analytics.nbParticipants', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
  });
});

// -----------------------------------------------------------------------------

Template.compareChart.onCreated(function compareChartOnCreated() {
  const template = this;
  template.dataAvailableRV = new ReactiveVar(false);
  template.shiftsDataRV = new ReactiveVar();
});

Template.compareChart.onRendered(function compareChartOnRendered() {
  const template = this;
  template.autorun(() => {
    template.shiftsDataRV.set(StatsCompare.find({}, {
      sort: {
        dayOfTheWeek: 1,
        brand: 1,
        contract: 1,
      },
    }).fetch());
    if (_.isEmpty(template.shiftsDataRV.get()) || Math.max.apply(null, _.pluck(template.shiftsDataRV.get(), `counter${this.data.chartFiltersRD.get('period').charAt(0).toUpperCase()}${this.data.chartFiltersRD.get('period').slice(1)}`)) < 1) {
      template.dataAvailableRV.set(false);
    } else {
      template.dataAvailableRV.set(true);
    }
  });
});

Template.compareChart.helpers({
  dataAvailableRV() {
    return Template.instance().dataAvailableRV;
  },
  dataAvailable() {
    return Template.instance().dataAvailableRV.get();
  },
  shiftsDataRV() {
    return Template.instance().shiftsDataRV;
  },
  details() {
    let nbParticipants = StatsNbParticipants.findOne();
    if (nbParticipants) {
      nbParticipants = nbParticipants.counter;
    } else {
      nbParticipants = 0;
    }
    return `${TAPi18n.__('components.chartCompare.periodFrom')} ${moment(this.chartFiltersRD.get('startDate').toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase())} ${TAPi18n.__('components.chartCompare.periodTo')} ${moment(this.chartFiltersRD.get('endDate').toString()).format(TAPi18n.__('components.pickadate.format').toUpperCase())} : ${nbParticipants} ${TAPi18n.__('components.chartCompare.participants')}`;
  },
});

// -----------------------------------------------------------------------------

Template.compareChartSvg.onCreated(() => {
  d3.tip = d3Tip;
  d3Extended(d3);
});

Template.compareChartSvg.onRendered(function compareChartSvgOnRendered() {
  const template = this;
  // ---------------------------------------------------------------------------
  // Statics
  const viewBoxWidth = 960;
  const viewBoxHeight = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +viewBoxWidth - margin.left - margin.right;
  const height = +viewBoxHeight - margin.top - margin.bottom;
  const svgChart = d3.select('#chart').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`).attr('width', '100%');
  const gChart = svgChart.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  const x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
  const x1 = d3.scaleBand().padding(0.05);
  const y = d3.scaleLinear().rangeRound([height, 0]);
  const svgLegend = d3.select('#legend').attr('preserveAspectRatio', 'xMinYMin meet').attr('width', '100%');
  const gLegend = svgLegend.append('g');
  let currentLanguage = TAPi18n.getLanguage();
  gChart
    .append('g')
    .attr('class', 'axis y')
    .append('text')
    .attr('id', 'axis-y-title')
    .attr('x', 2)
    .attr('y', y(y.ticks().pop()) + 0.5)
    .attr('dy', '0.32em')
    .attr('fill', '#000')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'start');
  gChart
    .append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0, ${height})`);
  gLegend
    .append('g')
    .attr('id', 'legend')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('fill', 'black');
  // ---------------------------------------------------------------------------
  // Dynamics
  template.autorun(() => {
    if (template.data.dataAvailableRV.get()) {
      if (TAPi18n.getLanguage() !== currentLanguage) {
        gChart.selectAll('rect').remove();
        currentLanguage = TAPi18n.getLanguage();
      }
      const data = template.data.shiftsDataRV.get();
      const customers = Customers.find({ city: this.data.chartFiltersRD.get('city') }, {}).fetch();
      const customersId = _.map(customers, customer => customer._id);
      const days = _.map([0, 1, 2, 3, 4, 5, 6], day => (day + parseInt(TAPi18n.__('components.pickadate.daysOfTheWeekOffset'), 10)) % 7);
      const week = _.map(TAPi18n.__('components.pickadate.weekdaysFull', { returnObjectTrees: true }), day => day);
      // -----------------------------------------------------------------------
      // Tips
      const tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html((d) => {
        const tips = computeData(d, template.data.chartFiltersRD);
        tips.kpi = Math.round(tips.kpi * 100) / 100;
        const hours = Math.floor(tips.duration / 60);
        const minutes = `0${tips.duration % 60}`.slice(-2);
        tips.duration = `${hours}h${minutes}`;
        return `${TAPi18n.__('components.chartCompare.tip.customer')}: ${tips.customer}<br/>${TAPi18n.__('components.chartCompare.tip.value')} : ${tips.kpi}<br/>${TAPi18n.__('components.chartCompare.tip.shiftsCounter')}: ${tips.counter}<br/>${TAPi18n.__('components.chartCompare.tip.totalDuration')}: ${tips.duration}<br/>${TAPi18n.__('components.chartCompare.tip.quality')}: <span style='color:green'>N/A</span>`;
      });
      gChart.call(tip);
      // -----------------------------------------------------------------------
      // X axis
      x0.domain(days);
      x1.domain(customersId).rangeRound([0, x0.bandwidth()]);
      gChart
        .select('.axis.x')
        .call(d3.axisBottom(x0)
        .tickFormat(d => week[d]));
      // -----------------------------------------------------------------------
      // Y axis
      y.domain([0, d3.max(data, d => computeData(d, template.data.chartFiltersRD).kpi)]).nice();
      gChart
        .select('.axis.y')
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).ticks())
        .select('#axis-y-title')
        .text(TAPi18n.__(`components.chartControls.kpi.${this.data.chartFiltersRD.get('kpi')}`));
      // -----------------------------------------------------------------------
      // Bars
      gChart
        .selectAll('.bar')
        .data(data, d => d._id)
        .exit()
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('y', height)
        .attr('height', 0)
        .remove();
      gChart
        .selectAll('.bar')
        .data(data, d => d._id)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${x0(d.dayOfTheWeek)},0)`)
        .attr('x', d => x1(d.customer))
        .attr('y', height)
        .attr('width', x1.bandwidth())
        .attr('height', 0)
        .attr('fill', d => d.color)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
      gChart
        .selectAll('.bar')
        .data(data, d => d._id)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('y', d => y(computeData(d, template.data.chartFiltersRD).kpi))
        .attr('height', d => height - y(computeData(d, template.data.chartFiltersRD).kpi));
      // -----------------------------------------------------------------------
      // Legend
      const legend = gLegend
        .select('g')
        .selectAll('g')
        .data(customers)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);
      legend
        .append('rect')
        .attr('x', 0)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', d => d.color);
      legend
        .append('text')
        .attr('x', 24)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .text(d => `${d.brand} > ${d.contract}`);
    }
  });
});
