import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
	context(path: string, deep?: boolean, filter?: RegExp): {
		keys(): string[];
		<T>(id: string): T;
	};
};

getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting()
);

// Search tests and load
const context = require.context('./', true, /\.(ts|js)$/);
context.keys().map(context);
