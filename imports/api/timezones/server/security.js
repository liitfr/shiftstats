import { Timezones } from '../timezones.js';

Timezones.permit(['insert', 'update', 'remove']).never();
