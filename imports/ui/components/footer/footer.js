import './footer.html';

Template.footer.helpers({
  copyrightYears() {
    const currentYear = new Date().getFullYear();
    if (currentYear === 2017) {
      return '2017';
    }
    return `2017 - ${currentYear}`;
  },
  contactUsAddress() {
    return Meteor.settings.public.contactUs;
  },
});
