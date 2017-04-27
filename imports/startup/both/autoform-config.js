import MessageBox from 'message-box';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

// TODO : can take exemple on i18n & datepicker to move translations from this file to i18n

MessageBox.defaults({
  messages: {
    en: {
      customerNotUnique: 'Customer must be unique',
      formulaNotValid: 'Formula isn\'t valid',
      validityIntervalNotValid: 'Validity interval isn\'t correct',
      applicationIntervalNotValid: 'Application interval isn\'t valid',
      periodOverlap: 'A pricing has already been defined in this period (or a portion)',
      cityNotInCountry: 'This city doesn\'t belong to this country',
      shiftInFuture: 'You cannot declare a shift in future',
      dayOverlap: `Your shift cannot be over two days. Days start at ${Meteor.settings.public.morningStartHour}`,
      noDuration: 'Your shift must have a duration',
    },
    fr: {
      customerNotUnique: 'Le client doit être unique',
      formulaNotValid: 'Cette formule n\'est pas valide',
      validityIntervalNotValid: 'L\'interval de validité doit être correct',
      applicationIntervalNotValid: 'L\'interval d\'application doit être valide',
      periodOverlap: 'Une tarification a déjà été définie sur cette période (ou une partie)',
      cityNotInCountry: 'Cette ville n\'appartient pas à ce pays',
      shiftInFuture: 'Tu ne peux pas déclarer un shift dans le futur',
      dayOverlap: `Ton shift ne peut être sur deux jours. Les journées commencent à ${Meteor.settings.public.morningStartHour}`,
      noDuration: 'Ton shift doit avoir une durée',
      required: '{{label}} est obligatoire',
      minString: '{{label}} doit contenir au moins {{min}} caractères',
      maxString: '{{label}} doit contenir moins de {{max}} caractères',
      minNumber: '{{label}} doit valoir plus de {{min}}',
      maxNumber: '{{label}} ne doit pas dépasser {{max}}',
      minNumberExclusive: '{{label}} doit être supérieur(e) à {{min}}',
      maxNumberExclusive: '{{label}} doit être inférieur(e) à {{max}}',
      minDate: '{{label}} doit être postérieur(e) à {{min}}',
      maxDate: '{{label}} ne peut être postérieur(e) à {{max}}',
      badDate: '{{label}} n\'est pas une date valide',
      minCount: 'Il faut spécifier au moins {{minCount}} valeurs',
      maxCount: 'Il faut spécifier moins de {{maxCount}} valeurs',
      noDecimal: '{{label}} doit être un nombre entier',
      notAllowed: '{{value}} n\'est pas une valeur autorisée',
      expectedType: '{{label}} doit être du type {{dataType}}',
    },
  },
});
