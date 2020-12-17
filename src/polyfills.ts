// *******************************************************
// BROWSER POLYFILLS

import 'classlist.js';

import 'mdn-polyfills/Array.prototype.forEach';
import 'core-js/features/set';
import 'core-js/features/map';

import './engine/polyfills/SetExtension';

// Zone JS is required by default for Angular itself.
import 'zone.js/dist/zone';  // Included with Angular CLI.
