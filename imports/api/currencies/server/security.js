import { Currencies } from '../currencies.js';

Currencies.permit(['insert', 'update', 'remove']).never();
