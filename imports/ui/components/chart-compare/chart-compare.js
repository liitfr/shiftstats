import * as d3 from 'd3';
// import { TAPi18n } from 'meteor/tap:i18n';

import { Customers } from '../../../api/customers/customers.js';
import { Shifts } from '../../../api/shifts/shifts.js';

import './chart-compare.html';

// TODO : loader
// TODO : tips indacteurs de confiance
// TODO : commencer le lundi si fr
// TODO : traduction jours
// TODO : formules génériques dépendantes de "indicateurs", "période", "simulateur"
// TODO : animations
// TODO : légendes (marques / contrats)

Template.chartCompare.onCreated(function chartCompareOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('shifts.analytics.compare', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
  });
});

Template.chartCompare.onRendered(function chartCompareOnRendered() {
  const template = this;
  const days = [0, 1, 2, 3, 4, 5, 6];
  const viewBoxWidth = 900;
  const viewBoxHeight = 500;
  const svg = d3.select('svg').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`).attr('width', '100%');
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +viewBoxWidth - margin.left - margin.right;
  const height = +viewBoxHeight - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  const x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
  const x1 = d3.scaleBand().padding(0.05);
  const y = d3.scaleLinear().rangeRound([height, 0]);
  template.autorun(() => {
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const customers = _.map(Customers.find({ city: this.data.chartFiltersRD.get('city') }, { fields: { _id: 1 } }).fetch(), customer => customer._id);
    const data = Shifts.find({}, {
      sort: {
        dayOfTheWeek: 1,
        brand: 1,
        contract: 1,
      },
    }).fetch();
    x0.domain(days);
    x1.domain(customers).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, d => d.nbDelivs)]).nice();
    g.selectAll('g').remove();
    g.append('g')
      .selectAll('g')
      .data(days)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(d)},0)`)
      .selectAll('rect')
      .data(day => _.filter(data, d => d.dayOfTheWeek === day))
      .enter()
      .append('rect')
      .attr('x', d => x1(d.customer))
      .attr('y', d => y(d.nbDelivs))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.nbDelivs))
      .attr('fill', d => d.color);
    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x0).tickFormat(d => week[d]));
  });
});
