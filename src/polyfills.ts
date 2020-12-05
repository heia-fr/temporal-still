// *******************************************************
// BROWSER POLYFILLS

import 'classlist.js';

import 'mdn-polyfills/Array.prototype.forEach';

import './engine/polyfills/SetExtension';
import './engine/polyfills/MapExtension';

// Zone JS is required by default for Angular itself.
import 'zone.js/dist/zone';  // Included with Angular CLI.
