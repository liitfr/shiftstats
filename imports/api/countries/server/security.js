import { Countries } from '../countries.js';

Countries.permit(['insert', 'update', 'remove']).never();
