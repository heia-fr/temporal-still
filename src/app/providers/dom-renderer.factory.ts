// SOURCE: https://github.com/angular/angular/issues/21782#issuecomment-460351057
//   DATE: 06.11.2020

import {
	APP_ID,
	Inject,
	Injectable,
	Provider,
	Renderer2,
	RendererType2,
} from '@angular/core';
import {
	EventManager,
	ɵDomRendererFactory2,
	ɵDomSharedStylesHost,
} from '@angular/platform-browser';

const delegateSetProperty = Symbol('DELEGATE_SET_PROPERTY');

/**
 * Fix inputs for Safari.
 * @see https://github.com/angular/angular/issues/21782
 */
function setProperty(this: Renderer2, el: any, name: string, value: any): void {
	if (name !== 'value' || el.value !== value) {
		(this as any)[delegateSetProperty].apply(this, arguments);
	}
}

@Injectable()
export class DomRendererFactory extends ɵDomRendererFactory2 {
	constructor(
		eventManager: EventManager,
		sharedStylesHost: ɵDomSharedStylesHost,
		@Inject(APP_ID) appId: string,
	) {
		super(eventManager, sharedStylesHost, appId);
	}

	createRenderer(element: any, type: RendererType2 | null): Renderer2 {
		const renderer = super.createRenderer(element, type);
		const constructor = renderer.constructor;
		/* Very hacky */
		if (!constructor.prototype[delegateSetProperty]) {
			constructor.prototype[delegateSetProperty] = renderer.setProperty;
			constructor.prototype.setProperty = setProperty;
		}
		return renderer;
	}
}

export const RENDERER_PROVIDERS: Provider[] = [
	{
		provide: ɵDomRendererFactory2,
		useClass: DomRendererFactory,
	},
];
