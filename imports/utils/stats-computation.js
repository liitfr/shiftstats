import { moment } from 'meteor/momentjs:moment';
import 'meteor/kevbuk:moment-range';

const computeData = (d, chartFiltersRD) => {
  let counter;
  let nbDelivs;
  let nbKms;
  let gains;
  let duration;
  let result;
  switch (chartFiltersRD.get('period')) {
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
  if (chartFiltersRD.get('payroll-activated')) {
    gains *= (1 - (chartFiltersRD.get('payroll-percentage') / 100));
  }
  switch (chartFiltersRD.get('kpi')) {
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
        result = gains / (duration / 60);
      } else {
        result = 0;
      }
      break;
    case 'delivsperhour':
      if (nbDelivs !== 0 && duration !== 0) {
        result = nbDelivs / (duration / 60);
      } else {
        result = 0;
      }
      break;
    case 'kmsperhour':
      if (nbKms !== 0 && duration !== 0) {
        result = nbKms / (duration / 60);
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
    customer: `${d.brand} > ${d.contract}`,
  };
};

const addMissingDays = (data, chartFiltersRD) => {
  const dataWithMissingDays = [];
  const range = moment().range(moment(chartFiltersRD.get('startDate').toString()).toDate(), moment(chartFiltersRD.get('endDate').toString()).toDate());
  range.by('days', (day) => {
    const dayString = day.format('YYYYMMDD');
    const dataIfExist = _.findWhere(data, { dateString: dayString });
    if (dataIfExist === undefined) {
      dataWithMissingDays.push({
        dateString: dayString,
        noData: true,
      });
    } else {
      dataWithMissingDays.push(dataIfExist);
    }
  });
  return dataWithMissingDays;
};

export { computeData, addMissingDays };
