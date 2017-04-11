import { Cities } from '../cities.js';

Cities.permit(['insert', 'update', 'remove']).never();
