// *******************************************************
// BROWSER POLYFILLS

import 'classlist.js';

import Util from './engine/helpers/Util';
Util.ensureForEach();
Util.ensureEvery();

// Zone JS is required by default for Angular itself.
import 'zone.js/dist/zone';  // Included with Angular CLI.
