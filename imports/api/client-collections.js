const ShiftsMine = new Meteor.Collection('shiftsMine');
const StatsCompare = new Mongo.Collection('statsCompare');
const StatsNbParticipants = new Mongo.Collection('statsNbParticipants');
const StatsEvol = new Mongo.Collection('statsEvol');

export { ShiftsMine, StatsCompare, StatsNbParticipants, StatsEvol };
