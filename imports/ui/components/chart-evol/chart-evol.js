import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import d3Extended from 'd3-extended';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import { Customers } from '../../../api/customers/customers.js';
import { Shifts } from '../../../api/shifts/shifts.js';

import '../loader/loader.js';
import './chart-evol.html';

// TODO : data quality
// TODO : ajouter niveaux historiques

Template.chartEvol.onCreated(function chartEvolOnCreated() {
  const template = this;
  template.autorun(() => {
    template.subscribe('shifts.analytics.evol', this.data.chartFiltersRD.get('city'), this.data.chartFiltersRD.get('startDate'), this.data.chartFiltersRD.get('endDate'));
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
    template.shiftsDataRV.set(Shifts.find({}, {
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
  shiftsDataRV() {
    return Template.instance().shiftsDataRV;
  },
});

// -----------------------------------------------------------------------------

Template.evolChartSvg.onCreated(function evolChartSvgOnCreated() {
  d3.tip = d3Tip;
  d3Extended(d3);
  const template = this;
  template.computeData = (d) => {
    let counter;
    let nbDelivs;
    let nbKms;
    let gains;
    let duration;
    let result;
    switch (this.data.chartFiltersRD.get('period')) {
      case 'fullday':
        counter = d.counter;
        nbDelivs = d.nbDelivs;
        nbKms = d.nbKms;
        gains = d.gains;
        duration = d.duration;
        break;
      case 'morning':
        counter = d.counterMorning;
        nbDelivs = d.nbDelivsMorning;
        nbKms = d.nbKmsMorning;
        gains = d.gainsMorning;
        duration = d.durationMorning;
        break;
      case 'lunch':
        counter = d.counterLunch;
        nbDelivs = d.nbDelivsLunch;
        nbKms = d.nbKmsLunch;
        gains = d.gainsLunch;
        duration = d.durationLunch;
        break;
      case 'afternoon':
        counter = d.counterAfternoon;
        nbDelivs = d.nbDelivsAfternoon;
        nbKms = d.nbKmsAfternoon;
        gains = d.gainsAfternoon;
        duration = d.durationAfternoon;
        break;
      case 'dinner':
        counter = d.counterDinner;
        nbDelivs = d.nbDelivsDinner;
        nbKms = d.nbKmsDinner;
        gains = d.gainsDinner;
        duration = d.durationDinner;
        break;
      case 'night':
        counter = d.counterNight;
        nbDelivs = d.nbDelivsNight;
        nbKms = d.nbKmsNight;
        gains = d.gainsNight;
        duration = d.durationNight;
        break;
      default:
        throw new Error('Non supported use case');
    }
    if (this.data.chartFiltersRD.get('payroll-activated')) {
      gains *= (1 - (this.data.chartFiltersRD.get('payroll-percentage') / 100));
    }
    switch (this.data.chartFiltersRD.get('kpi')) {
      case 'kmperdeliv':
        if (nbKms !== 0 && nbDelivs !== 0) {
          result = nbKms / nbDelivs;
        } else {
          result = 0;
        }
        break;
      case 'gainsperkm':
        if (gains !== 0 && nbKms !== 0) {
          result = gains / nbKms;
        } else {
          result = 0;
        }
        break;
      case 'gainsperdeliv':
        if (gains !== 0 && nbDelivs !== 0) {
          result = gains / nbDelivs;
        } else {
          result = 0;
        }
        break;
      case 'gainsperhour':
        if (gains !== 0 && duration !== 0) {
          result = gains / duration;
        } else {
          result = 0;
        }
        break;
      case 'delivsperhour':
        if (nbDelivs !== 0 && duration !== 0) {
          result = nbDelivs / duration;
        } else {
          result = 0;
        }
        break;
      case 'kmsperhour':
        if (nbKms !== 0 && duration !== 0) {
          result = nbKms / duration;
        } else {
          result = 0;
        }
        break;
      default:
        throw new Error('Non supported use case');
    }
    return {
      counter,
      duration,
      kpi: result,
    };
  };
});

Template.evolChartSvg.onRendered(function evolChartSvgOnRendered() {
  const template = this;
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
    if (template.data.dataAvailableRV.get()) {
      const data = template.data.shiftsDataRV.get();
      const customers = Customers.find({ city: this.data.chartFiltersRD.get('city') }, {}).fetch();
      const customersId = _.map(customers, customer => customer._id);
      const days = _.map([0, 1, 2, 3, 4, 5, 6], day => (day + parseInt(TAPi18n.__('components.pickadate.daysOfTheWeekOffset'), 10)) % 7);
      const week = _.map(TAPi18n.__('components.pickadate.weekdaysFull', { returnObjectTrees: true }), day => day);
      const tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html((d) => {
        const tips = template.computeData(d);
        tips.kpi = Math.round(tips.kpi * 100) / 100;
        const hours = Math.floor(tips.duration / 60);
        const minutes = `0${tips.duration % 60}`.slice(-2);
        tips.duration = `${hours}h${minutes}`;
        return `${TAPi18n.__('components.chartEvol.tip.value')}: ${tips.kpi}<br/>${TAPi18n.__('components.chartEvol.tip.shiftsCounter')}: ${tips.counter}<br/>${TAPi18n.__('components.chartEvol.tip.totalDuration')}: ${tips.duration}<br/>${TAPi18n.__('components.chartEvol.tip.quality')}: <span style='color:green'>N/A</span>`;
      });
      g.call(tip);
      x0.domain(days);
      x1.domain(customersId).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(data, d => template.computeData(d).kpi)]).nice();
      g.selectAll('rect').remove();
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
        .attr('class', 'bar')
        .attr('x', d => x1(d.customer))
        // .attr('y', d => y(template.computeData(d).kpi))
        .attr('y', height)
        .attr('width', x1.bandwidth())
        // .attr('height', d => height - y(template.computeData(d).kpi))
        .attr('height', 0)
        .attr('fill', d => d.color)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('y', d => y(template.computeData(d).kpi))
        .attr('height', d => height - y(template.computeData(d).kpi));
      g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x0).tickFormat(d => week[d]));
      g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).ticks())
        .append('text')
        .attr('x', 2)
        .attr('y', y(y.ticks().pop()) + 0.5)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text(TAPi18n.__(`components.chartControls.kpi.${this.data.chartFiltersRD.get('kpi')}`));
        // TODO : remove ALL styles to css
      const legend = g.append('g')
        .attr('id', 'legend')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .selectAll('g')
        .data(customers)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);
        // .on('mouseover', () => d3.select('#legend').moveToFront())
        // .on('mouseout', () => d3.select('#legend').moveToBack());
      legend.append('rect')
        .attr('x', width - 19)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', d => d.color);
      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .text(d => `${d.brand} > ${d.contract}`);
    }
  });
});
