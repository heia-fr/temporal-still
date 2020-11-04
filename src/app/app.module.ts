import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { HowToComponent } from './howto/howto.component';

import { SignalFormatterPipe } from './pipes/signal-formatter.pipe';
import { FormulaFormatterPipe } from './pipes/formula-formatter.pipe';

import { SignalValidatorDirective } from './directives/signal.validator';
import { FormulaValidatorDirective } from './directives/formula.validator';
import { EditableSignalValidatorDirective } from './directives/editable-signal.validator';
import { EditableFormulaValidatorDirective } from './directives/editable-formula.validator';

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
		SignalFormatterPipe,
		FormulaFormatterPipe,
		// Validators
		SignalValidatorDirective,
		FormulaValidatorDirective,
		EditableSignalValidatorDirective,
		EditableFormulaValidatorDirective,
		// Directives
		GainFocusDirective,
		OnEnterDirective,
		OnEscapeDirective,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
