declare var $: any;

import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import PerfectScrollbar from 'perfect-scrollbar';
import { SignalsService } from '../services/signals.service';
import Symbols from 'src/engine/helpers/Symbols';
import TemporalFormulaInterpreter from 'src/engine/analysers/TemporalFormulaInterpreter';
import {
	FormulaGenerator,
	BooleanSignalGenerator,
} from 'src/engine/generators';
import {
	BooleanSignal,
	TemporalFormula,
} from 'src/engine/entities';

function nvd3WrapUpdate(chart: any, updateCallback: any) {
	var oldUpdate = chart.update;
	function Wrapper() {
		var args = Array(arguments);
		var update = oldUpdate.bind(this, args);
		args.unshift(update);
		args = [update].concat(args);
		updateCallback.apply(this, args);
		chart.update = Wrapper;
	}
	chart.update = Wrapper;
}

function initPerfectScrollbar(container: any, selector: string) {
	container[selector] = new PerfectScrollbar(selector, {
		wheelSpeed: 0.4,
		wheelPropagation: false,
	});
}

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

	public signalsService: SignalsService;

	public perfectScrollbars: any = {};

	public buttonState = {
		// a toggle boolean used to change the icon of the signals
		// collapse button
		signalsUp: true,
		// used to change the content of the signals toggle button's
		// tooltip dynamically
		signalsTitle: 'Hide signals panel',
		// a toggle boolean used to change the icon of the formulas
		// collapse button
		formulasUp: true,
		// used to change the content of the formulas toggle button's
		// tooltip dynamically
		formulasTitle: 'Hide formulas panel',
	};

	public editableSignal = { text: "", id: "", };
	public editableFormula = { text: "", id: "", };

	public signalsString = "";
	public formulaString = "";

	public nvd3Options: any = {
		chart: {
			type: 'lineChart',
			height: 70,
			margin: {
				left: 15,
				top: 20,
				bottom: 20,
				right: 10,
			},
			forceY: [0, 1],
			clipEdge: false,
			showXAxis: true,
			showYAxis: true,
			useInteractiveGuideline: false,
			interactive: false,
			showLegend: true,
			legend: {
				radioButtonMode: false,
			},
			x: function(d: any) {
				return d[0];
			},
			y: function(d: any) {
				return d[1];
			},
		}
	};

	constructor(signalsService: SignalsService) {
		this.signalsService = signalsService;
		this.perfectScrollbars = {};
		this.nvd3Options.chart.callback = this.prepareChart();
	}

	ngOnInit(): void {
		// update chart when launching the app
		this.updateSignalsCharts();
		this.updateFormulasCharts();
	}

	ngAfterViewInit() {
		$('[data-tooltip="tooltip"]').tooltip({
			'trigger': 'hover'
		});

		initPerfectScrollbar(this.perfectScrollbars, '#signalsList');
		initPerfectScrollbar(this.perfectScrollbars, '#formulasList');
		//initPerfectScrollbar(this.perfectScrollbars, '.chart-grid');
	}

	// hook an event handle to the window object so when the user
	// clicks outside the editor text field, it will be hidden
	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent) {
		var editor = event.target as HTMLElement;
		if (!editor || editor.classList.contains("alambic-editorField")) return;

		for (let signal of this.signalsService.universe.getSignals()) {
			if (signal.isEditorEnabled()) {
				signal.setEditorEnabled(false);
			}
		}

		for (let formula of this.signalsService.formulasManager.getFormulas()) {
			if (formula.isEditorEnabled()) {
				formula.setEditorEnabled(false);
			}
		}
	};

	prepareChart() {
		return function (chart: any) {
			var xMax = chart.xScale().domain().slice(-1)[0];
			chart.xAxis
				.ticks(null)
				.tickValues(d3.range(xMax + 1))
				.tickFormat(d3.format(",.0f"));

			chart.yAxis
				.ticks(null)
				.tickValues(d3.range(2))
				.tickFormat(d3.format(",.0f"));

			nvd3WrapUpdate(chart, function (update: any) {
				update();

				var fmt = this.xAxis.tickFormat();
				var scale = this.xAxis.scale();
				var container = d3.select(this.container).select('g.nv-x');
				var wrap = container.selectAll('g.nv-wrap.nv-axis');
				var g = wrap.select('g');
				var xTicks = g.selectAll('g').select("text");
				var axisMaxMin = wrap.selectAll('g.nv-axisMaxMin');

				var lastIdx = 0;
				xTicks.attr('transform', function (d: any, i: any) {
					lastIdx = i;
					if (i == 0) i = 1;
					return 'translate(' + -scale(d) / (2 * i) + ', 0)';
				}).text(function (d: any, i: any) {
					var v = fmt(d);
					return ('' + v).match('NaN') ? '' : (v - 1);
				});
				lastIdx++;

				axisMaxMin.select('text')
					.attr('transform', function (d: any, i: any) {
						return 'translate(' + -scale(d) / (2 * lastIdx) + ', 0)';
					})
					.text(function (d: any, i: any) {
						var v = fmt(d);
						return (('' + v).match('NaN') || (v <= 0)) ? '' : (v - 1);
					});
			});

			chart.xAxis.ticks(d3.time.second, 1);

			chart.update();

			setTimeout(function () {
				chart.xAxis.axis.ticks(d3.time.second, 1);

				chart.update();
			}, 500);
		};
	};

	/**
	 * methods to toggle the boolean variables
	 */
	toggleSignalsPanel() {
		this.buttonState.signalsUp = !this.buttonState.signalsUp;
		this.buttonState.signalsTitle = this.buttonState.signalsUp
			? 'Hide signals panel' : 'Show signals panel';
	};
	toggleFormlasPanel() {
		this.buttonState.formulasUp = !this.buttonState.formulasUp;
		this.buttonState.formulasTitle = this.buttonState.formulasUp
			? 'Hide formulas panel' : 'Show formulas panel';
	};

	/**
	 * ****************** private methods *********************
	 */

	// update the scroll bar associated with provided element's selector
	updateScrollBar(selector: string) {
		let perfectScrollbar = this.perfectScrollbars[selector];
		if (perfectScrollbar == null) return;
		perfectScrollbar.update();
	}

	// update boolean charts
	updateSignalsCharts() {
		let universe = this.signalsService.universe;
		for (let signal of universe.getSignals()) {
			signal.calculateChartValues(universe.getLength());
		}
	}
	updateFormulasCharts() {
		let formulasManager = this.signalsService.formulasManager;
		let universe = this.signalsService.universe;
		for (let formula of formulasManager.getFormulas()) {
			formula.calculateChartValues(universe.getLength());
		}
	}

	// when removing a formula, release the referenced
	// boolean signals
	removeReferringFormula(tf: TemporalFormula) {
		let universe = this.signalsService.universe;
		for (let id of tf.getReferredBooleanSignalsIds()) {
			var bs = universe.signalById(id);
			bs.removeReferringTemporalFormulaId(tf.getId());
		}
	}

	// after updating a boolean signal, update temporal formulas
	// that reference it
	reevaluateReferringTemporalFormulas(s: BooleanSignal) {
		let formulasManager = this.signalsService.formulasManager;
		let universe = this.signalsService.universe;
		for (let fId of s.getReferringTemporalFormulasIds()) {
			var tf = formulasManager.formulaById(fId);
			tf = TemporalFormulaInterpreter.evaluate(tf.getContent(), universe);
			if (tf instanceof TemporalFormula) {
				formulasManager.updateFormula(fId, tf);
			}
		}
	}

	/**
	 * ************* Signals management operations *************
	 */

	// method to enable the signals editor
	enableSignalEditor(id: any, event: Event, form: NgForm) {
		for (let s of this.signalsService.universe.getSignals()) {
			s.setEditorEnabled(false);
		}

		var s = this.signalsService.universe.signalById(id);
		s.setEditorEnabled(true);
		this.editableSignal.text = s.getContent();
		this.editableSignal.id = id;
		form.form.markAsPristine();
		form.form.markAsUntouched();
		event.stopPropagation();
	};

	// method to disable the signals editors
	disableSignalEditor(event: Event, id: any) {
		var s = this.signalsService.universe.signalById(id);
		s.setEditorEnabled(false);
		this.editableSignal.text = s.getContent();
		event.stopPropagation();
	};

	// method used to add provided boolean signals to the universe
	addSignals(form: NgForm) {
		var signalStr = this.signalsString.trim();
		var id = signalStr.split(Symbols.getEqual())[0].trim();
		var bs = null;
		// add the current signal to the universe
		if (this.signalsService.universe.containsSignal(id)) {
			bs = this.signalsService.universe.signalById(id);
			if (bs.getContent() === signalStr) { return; }
		}

		var newS = new BooleanSignal(signalStr, null);
		// if a boolean signal with the same ID exists, override it
		// and update the referencing formulas
		if (bs && bs.isReferred()) {
			newS.setReferringTemporalFormulasIds(bs.getReferringTemporalFormulasIds());
			this.signalsService.universe.updateSignal(id, newS);
			this.reevaluateReferringTemporalFormulas(newS);
		} else {
			this.signalsService.universe.addSignal(newS);
		}

		this.signalsString = Symbols.getEmpty();
		// update the graphical charts and save the universe's and
		// formulas manager's states
		this.updateSignalsCharts();
		this.updateFormulasCharts();
		// update scroll bar
		this.updateScrollBar('#signalsList');
		this.updateScrollBar('.chart-grid');
		this.signalsService.saveUniverse();
		this.signalsService.saveFormulasManager();

		// clean the text field
		form.form.markAsPristine();
		form.form.markAsUntouched();
	};

	// update the boolean signal corresponding to the provided ID
	updateSignal(event: Event, id: any) {
		var s = this.signalsService.universe.signalById(id);
		var str = this.editableSignal.text.trim();
		// skip the processing if it's not necessary
		if (s.getContent().trim() === str) {
			this.disableSignalEditor(event, id);
			return;
		}

		// update the signal and reevaluate the referencing formulas
		var newS = new BooleanSignal(str, null);
		newS.setReferringTemporalFormulasIds(s.getReferringTemporalFormulasIds());
		this.signalsService.universe.updateSignal(id, newS);
		this.reevaluateReferringTemporalFormulas(newS);

		// update the graphical charts and save the universe's and
		// formulas manager's states
		this.updateSignalsCharts();
		this.updateFormulasCharts();
		this.signalsService.saveUniverse();
		this.signalsService.saveFormulasManager();

		// hide the editor
		this.disableSignalEditor(event, id);
	};

	// remove the boolean signal corresponding to the provided ID
	removeSignal(id: any) {
		this.signalsService.universe.removeSignal(id);
		// recalculate the universe's length by
		// taking into account the formulas' associated
		// boolean signals
		for (let f of this.signalsService.formulasManager.getFormulas()) {
			this.signalsService.universe.calculateMaxLength(f.getAssociatedSignal());
		}

		// update the graphical charts and save the universe's and
		// formulas manager's states
		this.updateSignalsCharts();
		this.updateFormulasCharts();
		this.signalsService.saveUniverse();
		this.signalsService.saveFormulasManager();

		// update scroll bar
		this.updateScrollBar('#signalsList');
		this.updateScrollBar('.chart-grid');
	};

	// generate random boolean signals
	generateSignals() {
		this.signalsString = BooleanSignalGenerator
			.generateBooleanSignals(this.signalsService.formulasManager);
	};

	// clear the universe
	clearSignals() {
		this.signalsService.universe.clear();
		// update scroll bar
		this.updateScrollBar('#signalsList');
		this.updateScrollBar('.chart-grid');
		this.signalsService.saveUniverse();
	};

	/**
	 * ******************** Formulas management ********************
	 */

	// method to enable the formulas editor
	enableFormulaEditor(id: any, event: Event, form: NgForm) {
		for (let f of this.signalsService.formulasManager.getFormulas()) {
			f.setEditorEnabled(false);
		}

		var f = this.signalsService.formulasManager.formulaById(id);
		f.setEditorEnabled(true);
		this.editableFormula.text = f.getContent();
		this.editableFormula.id = id;
		form.form.markAsPristine();
		form.form.markAsUntouched();
		event.stopPropagation();
	};

	// method to disable the formulas editor
	disableFormulaEditor(event: Event, id: any) {
		var f = this.signalsService.formulasManager.formulaById(id);
		f.setEditorEnabled(false);
		this.editableFormula.text = f.getContent();
		event.stopPropagation();
	};

	// add the entered formula to the formulas manager
	addFormula(form: NgForm) {
		var fId = this.formulaString.split(Symbols.getEqual())[0].trim();
		// it a formula with the same ID exists, override it
		if (this.signalsService.formulasManager.containsFormula(fId)) {
			let tf = this.signalsService.formulasManager.formulaById(fId);
			this.removeReferringFormula(tf);
		}

		// evaluate the formula
		let tf = TemporalFormulaInterpreter.evaluate(this.formulaString,
			this.signalsService.universe);
		if (tf instanceof TemporalFormula) {
			this.signalsService.formulasManager.addFormula(tf);

			// update the graphical charts and save the universe's and
			// formulas manager's states
			this.updateFormulasCharts();
			// update scroll bar
			this.updateScrollBar('#formulasList');
			this.updateScrollBar('.chart-grid');
			this.signalsService.saveUniverse();
			this.signalsService.saveFormulasManager();
			this.formulaString = "";

			// clean the text field
			form.form.markAsPristine();
			form.form.markAsUntouched();
		}
	};

	// update the formula corresponding to the provided ID
	updateFormula(event: Event, id: any) {
		var tf = this.signalsService.formulasManager.formulaById(id);
		var str = this.editableFormula.text.trim();

		// skip if updating is not necessary
		if (tf.getContent().trim() === str) {
			this.disableFormulaEditor(event, id);
			return;
		}

		this.removeReferringFormula(tf);

		// evaluate the formula
		tf = TemporalFormulaInterpreter.evaluate(str, this.signalsService.universe);
		if (tf instanceof TemporalFormula) {
			this.signalsService.formulasManager.updateFormula(id, tf);

			// update the graphical charts and save the universe's and
			// formulas manager's states
			this.updateFormulasCharts();
			this.signalsService.saveUniverse();
			this.signalsService.saveFormulasManager();
			this.disableFormulaEditor(event, id);
		}
	};

	// remove the formula corresponding to provided ID
	removeFormula(id: any) {
		var tf = this.signalsService.formulasManager.formulaById(id);

		this.removeReferringFormula(tf);

		this.signalsService.formulasManager.removeFormula(id);

		// update the graphical charts and save the universe's and
		// formulas manager's states
		this.updateFormulasCharts();
		// update scroll bar
		this.updateScrollBar('#formulasList');
		this.updateScrollBar('.chart-grid');
		this.signalsService.saveUniverse();
		this.signalsService.saveFormulasManager();
	};

	// generate a random temporal formulas
	generateFormula() {
		// LTLFormulaGenerator
		this.formulaString = FormulaGenerator
			.generateTemporalFormula(this.signalsService.universe);
	};

	// clear the formulas manager
	clearFormulas() {
		this.signalsService.universe.clearReferences();
		this.signalsService.formulasManager.clear();
		// update scroll bar
		this.updateScrollBar('#formulasList');
		this.updateScrollBar('.chart-grid');
		// save formulas and universe
		this.signalsService.saveFormulasManager();
		this.signalsService.saveUniverse();
	};

	/**
	 * ******************** ngForOf trackBy ********************
	 */

	trackById(index: Number, entity: any) {
		return entity.getId();
	}
}
