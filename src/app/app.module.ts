import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

import { RENDERER_PROVIDERS } from './providers/dom-renderer.factory';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { HowToComponent } from './howto/howto.component';

import { TemporalEntityFormatterPipe } from './pipes/temporal-entity-formatter.pipe';

import { TemporalEntityValidatorDirective } from './directives/temporal-entity.validator';
import { EditableTemporalEntityValidatorDirective } from './directives/editable-temporal-entity.validator';

import { GainFocusDirective } from './directives/gain-focus.directive';
import { OnEnterDirective } from './directives/on-enter.directive';
import { OnEscapeDirective } from './directives/on-escape.directive';

@NgModule({
	declarations: [
		// Components
		AppComponent,
		AboutComponent,
		HomeComponent,
		HowToComponent,
		// Pipes
		TemporalEntityFormatterPipe,
		// Validators
		TemporalEntityValidatorDirective,
		EditableTemporalEntityValidatorDirective,
		// Directives
		GainFocusDirective,
		OnEnterDirective,
		OnEscapeDirective,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
        NvD3Module,
        SweetAlert2Module.forRoot(),
	],
	providers: [RENDERER_PROVIDERS],
	bootstrap: [AppComponent]
})
export class AppModule { }
