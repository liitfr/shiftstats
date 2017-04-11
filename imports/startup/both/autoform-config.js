import MessageBox from 'message-box';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

MessageBox.defaults({
  messages: {
    en: {
      customerNotUnique: 'Customer must be unique',
      formulaNotValid: 'Formula isn\'t valid',
      validityIntervalNotValid: 'Validity interval isn\'t correct',
      applicationIntervalNotValid: 'Application interval isn\'t valid',
      periodOverlap: 'A pricing has already been defined in this period (or a portion)',
      cityNotInCountry: 'This city doesn\'t belong to this country',
    },
    fr: {
      customerNotUnique: 'Le client doit être unique',
      formulaNotValid: 'Cette formule n\'est pas valide',
      validityIntervalNotValid: 'L\'interval de validité doit être correct',
      applicationIntervalNotValid: 'L\'interval d\'application doit être valide',
      periodOverlap: 'Une tarification a déjà été définie sur cette période (ou une partie)',
      cityNotInCountry: 'Cette ville n\'appartient pas à ce pays',
      required: '{{label}} est obligatoire',
      minString: '{{label}} doit contenir au moins {{min}} caractères',
      maxString: '{{label}} doit contenir moins de {{max}} caractères',
      minNumber: '{{label}} doit valoir au moins {{min}}',
      maxNumber: '{{label}} ne doit pas dépasser {{max}}',
      minNumberExclusive: '{{label}} doit être supérieur(e) à {{min}}',
      maxNumberExclusive: '{{label}} doit être inférieur(e) à {{max}}',
      minDate: '{{label}} doit être postérieur(e) à {{min}}',
      maxDate: '{{label}} ne peut être postérieur(e) à {{max}}',
      badDate: '{{label}} n\'est pas une date valide',
      minCount: 'You must specify at least {{minCount}} values',
      maxCount: 'You cannot specify more than {{maxCount}} values',
      noDecimal: '{{label}} must be an integer',
      notAllowed: '{{value}} is not an allowed value',
      expectedType: '{{label}} must be of type {{dataType}}',
    },
  },
});
