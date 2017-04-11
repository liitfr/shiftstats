import { Customers } from '../customers.js';

Customers.permit(['insert', 'update', 'remove']).ifHasRole('admin').allowInClientCode();
