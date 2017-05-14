import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import d3Extended from 'd3-extended';
import { interpolatePath } from 'd3-interpolate-path';
import { lineChunked } from 'd3-line-chunked';
import { transition } from 'd3-transition';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import { computeData, addMissingDays } from '../../../utils/stats-computation.js';

// TODO : transition duration : 1000

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
        dateString: -1,
      },
    }).fetch());
    // TODO : doesn't work when counter is 0.
    if (_.isEmpty(template.shiftsDataRV.get())) {
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

Template.evolChartSvg.onCreated(() => {
  d3.transition = transition;
  d3.tip = d3Tip;
  d3Extended(d3);
  d3.interpolatePath = interpolatePath;
  d3.lineChunked = lineChunked;
});

Template.evolChartSvg.onRendered(function evolChartSvgOnRendered() {
  const template = this;
  // ---------------------------------------------------------------------------
  // Statics
  const viewBoxWidth = 960;
  const viewBoxHeight = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +viewBoxWidth - margin.left - margin.right;
  const height = +viewBoxHeight - margin.top - margin.bottom;
  const svgChart = d3
    .select(`#chart-${this.data.customer._id}`)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
    .attr('width', '100%')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  svgChart
    .append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0,${height})`);
  svgChart
    .append('g')
    .attr('class', 'axis y');
  const legend = svgChart
    .append('g')
    .attr('class', 'legend')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end');
  legend.append('rect')
    .attr('x', width - 19)
    .attr('width', 19)
    .attr('height', 19);
  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em');
  // ---------------------------------------------------------------------------
  // Dynamics
  template.autorun(() => {
    if (Template.currentData().customer) {
      const data =
        addMissingDays(Template.currentData().customer.statsPerDay, this.data.chartFiltersRD);
      d3.timeFormatDefaultLocale(TAPi18n.__('components.d3TimeFormat', { returnObjectTrees: true }));
      // -----------------------------------------------------------------------
      // Tips
      const tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html((d) => {
        const tips = computeData(d, this.data.chartFiltersRD);
        tips.kpi = Math.round(tips.kpi * 100) / 100;
        const hours = Math.floor(tips.duration / 60);
        const minutes = `0${tips.duration % 60}`.slice(-2);
        tips.duration = `${hours}h${minutes}`;
        return `${TAPi18n.__('components.chartEvol.tip.customer')}: ${tips.customer}<br/>${TAPi18n.__('components.chartEvol.tip.date')}: ${moment(d.dateString).format(TAPi18n.__('components.pickadate.format').toUpperCase())}<br/>${TAPi18n.__('components.chartEvol.tip.value')} : ${tips.kpi}<br/>${TAPi18n.__('components.chartEvol.tip.shiftsCounter')}: ${tips.counter}<br/>${TAPi18n.__('components.chartEvol.tip.totalDuration')}: ${tips.duration}<br/>${TAPi18n.__('components.chartEvol.tip.quality')}: <span style='color:green'>N/A</span>`;
      });
      svgChart.call(tip);
      // -----------------------------------------------------------------------
      // X axis
      const x = d3
        .scaleTime()
        .range([0, width])
        .domain([moment(this.data.chartFiltersRD.get('startDate').toString()).toDate(), moment(this.data.chartFiltersRD.get('endDate').toString()).toDate()])
        .nice();
      svgChart
        .select('.axis.x')
        .transition()
        .duration(250)
        .call(d3.axisBottom(x));
      // -----------------------------------------------------------------------
      // Y axis
      const minY = d3.min(data, d => computeData(d, this.data.chartFiltersRD).kpi);
      const maxY = d3.max(data, d => computeData(d, this.data.chartFiltersRD).kpi);
      const padding = maxY === minY ? 1 : (maxY - minY) / 5;
      const y = d3
        .scaleLinear()
        .range([height, 20])
        .domain([minY - padding,
          maxY + padding])
        .nice();
      svgChart
        .select('.axis.y')
        .transition()
        .duration(250)
        .call(d3.axisLeft(y));
      // -----------------------------------------------------------------------
      // Line & path
      svgChart
        .append('g')
        .attr('class', 'chunked-line');
      const line = d3
        .lineChunked()
        .x(d => x(moment(d.dateString).toDate()))
        .y(d => y(computeData(d, this.data.chartFiltersRD).kpi))
        .curve(d3.curveMonotoneX)
        .defined(d => !_.has(d, 'noData'))
        .extendEnds(x.range())
        .lineStyles({
          stroke: this.data.customer.color,
          'stroke-width': 2.5,
        });
      svgChart
        .select('.chunked-line')
        .datum(data)
        .transition()
        .duration(250)
        .call(line);
      // -----------------------------------------------------------------------
      // Dots
      svgChart
        .selectAll('.dot')
        .data(data.filter(d => !_.has(d, 'noData')), d => d._id)
        .exit()
        .remove();
      svgChart
        .selectAll('.dot')
        .data(data.filter(d => !_.has(d, 'noData')), d => d._id)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('stroke', this.data.customer.color)
        .attr('opacity', 0)
        .attr('cx', line.x())
        .attr('cy', line.y())
        .attr('r', 3.5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
      svgChart
        .selectAll('.dot')
        .data(data.filter(d => !_.has(d, 'noData')), d => d._id)
        .transition()
        .duration(250)
        .attr('opacity', 1)
        .attr('cx', line.x())
        .attr('cy', line.y());
      // -----------------------------------------------------------------------
      // Legend
      svgChart
        .select('.legend')
        .select('rect')
        .attr('fill', Template.currentData().customer.color);
      svgChart
        .select('.legend')
        .select('text')
        .text(`${Template.currentData().customer.brand} > ${Template.currentData().customer.contract}`);
    }
  });
});

Template.evolChartSvg.helpers({
  svgId() {
    return `chart-${this.customer._id}`;
  },
});
