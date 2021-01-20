declare let $: any;

import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { SignalsService } from '../services/signals.service';
import { SATService } from '../services/sat.service';
import { Symbols } from 'src/engine/helpers';
import { TemporalEntityInterpreter } from 'src/engine/analysers';
import {
	generateTemporalFormula,
	generateBooleanSignals,
} from 'src/engine/generators';
import {
	TemporalEntity,
	TemporalFormula,
} from 'src/engine/entities';

function nvd3WrapUpdate(chart: any, updateCallback: any): void {
	let oldUpdate = chart.update;
	function Wrapper(): void {
		let args = Array(arguments);
		let update = oldUpdate.bind(this, args);
		args.unshift(update);
		args = [update].concat(args);
		updateCallback.apply(this, args);
		chart.update = Wrapper;
	}
	chart.update = Wrapper;
}

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {

	public minimizeSwalOptions: SweetAlertOptions = {
		title: 'Are you sure?',
		text: 'By minimizing the signals, the existing ones will be replaced and you won\'t be able to revert the changes without modifying the signals!',
		confirmButtonText: 'Minimize!',
		denyButtonText: 'Cancel',
		showCancelButton: true,
		showClass: {
			popup: 'swal2-noanimation',
			backdrop: 'swal2-noanimation',
		},
		hideClass: {
			popup: '',
			backdrop: '',
		},
	};

	public buttonState = {
		// a toggle boolean used to change the icon of the signals
		// and formulas collapse button
		isExpanded: true,
		// used to change the content of the signals and formulas
		// toggle button's tooltip dynamically
		title: 'Hide signals and formulas panel',
	};

	public editableSignal = { text: '', id: '', };

	public signalsString = '';

	private analyses: string[] = [];

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
			x: (d: any) => {
				return d[0];
			},
			y: (d: any) => {
				return d[1];
			},
		}
	};

	constructor(public signalsService: SignalsService, public satService: SATService) {
		this.nvd3Options.chart.callback = this.prepareChart();
	}

	ngOnInit(): void {
		// update chart when launching the app
		this.updateSignalsCharts();
	}

	ngAfterViewInit(): void {
		$('[data-tooltip="tooltip"]').tooltip({
			trigger: 'hover',
		});
	}

	// hook an event handle to the window object so when the user
	// clicks outside the editor text field, it will be hidden
	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent): void {
		let editor = event.target as HTMLElement;
		if (!editor || editor.classList.contains('alambic-editorField')) return;

		for (let signal of this.signalsService.universe.getEntities()) {
			if (signal.isEditorEnabled()) {
				signal.setEditorEnabled(false);
			}
		}
	}

	prepareChart(): (chart: any) => void {
		return function(chart: any): void {
			let xMax = chart.xScale().domain().slice(-1)[0];
			chart.xAxis
				.ticks(null)
				.tickValues(d3.range(xMax + 1))
				.tickFormat(d3.format(',.0f'));

			chart.yAxis
				.ticks(null)
				.tickValues(d3.range(2))
				.tickFormat(d3.format(',.0f'));

			nvd3WrapUpdate(chart, function(update: any): void {
				update();

				let fmt = this.xAxis.tickFormat();
				let scale = this.xAxis.scale();
				let container = d3.select(this.container).select('g.nv-x');
				let wrap = container.selectAll('g.nv-wrap.nv-axis');
				let g = wrap.select('g');
				let xTicks = g.selectAll('g').select('text');
				let axisMaxMin = wrap.selectAll('g.nv-axisMaxMin');

				let lastIdx = 0;
				xTicks.attr('transform', (d: any, i: any) => {
					lastIdx = i;
					if (i === 0) i = 1;
					return 'translate(' + -scale(d) / (2 * i) + ', 0)';
				}).text((d: any, i: any) => {
					let v = fmt(d);
					return ('' + v).match('NaN') ? '' : (v - 1);
				});
				lastIdx++;

				axisMaxMin.select('text')
					.attr('transform', (d: any, i: any) => {
						return 'translate(' + -scale(d) / (2 * lastIdx) + ', 0)';
					})
					.text((d: any, i: any) => {
						let v = fmt(d);
						return (('' + v).match('NaN') || (v <= 0)) ? '' : (v - 1);
					});
			});

			chart.xAxis.ticks(d3.time.second, 1);

			chart.update();

			setTimeout(() => {
				chart.xAxis.axis.ticks(d3.time.second, 1);

				chart.update();
			}, 500);
		};
	}

	/**
	 * methods to toggle the boolean variables
	 */
	toggleSignalsPanel(): void {
		this.buttonState.isExpanded = !this.buttonState.isExpanded;
		this.buttonState.title = this.buttonState.isExpanded
			? 'Hide signals panel' : 'Show signals panel';
	}

	/**
	 * ****************** private methods *********************
	 */

	// update boolean charts
	updateSignalsCharts(): void {
		let universe = this.signalsService.universe;
		for (let signal of universe.getEntities()) {
			signal.calculateChartValues(universe.getLength());
		}
	}

	// after updating a boolean signal, update temporal formulas
	// that reference it
	reevaluateReferringTemporalFormulas(s: any): void {
		let universe = this.signalsService.universe;
		for (let fId of s.getReferencedBy()) {
			let tf: any = universe.getEntity(fId);
			tf = TemporalEntityInterpreter.evaluate(tf.getContent(), universe);
			if (tf instanceof TemporalFormula) {
				universe.putEntity(tf);
			}
		}
	}

	/**
	 * ************* Signals management operations *************
	 */

	// method to enable the signals/formulas editor
	enableSignalEditor(id: any, event: Event, form: NgForm): void {
		for (let s of this.signalsService.universe.getEntities()) {
			s.setEditorEnabled(false);
		}

		let s: any = this.signalsService.universe.getEntity(id);
		s.setEditorEnabled(true);
		this.editableSignal.text = s.getContent();
		this.editableSignal.id = id;
		form.form.markAsPristine();
		form.form.markAsUntouched();
		event.stopPropagation();
	}

	// method to disable the signals editors
	disableSignalEditor(event: Event, id: any): void {
		let s: any = this.signalsService.universe.getEntity(id);
		s.setEditorEnabled(false);
		this.editableSignal.text = s.getContent();
		event.stopPropagation();
	}

	// method used to add provided boolean signals to the universe
	addSignals(form: NgForm): void {
		let signalStr = this.signalsString.trim();
		let id = signalStr.split(Symbols.getEqual())[0].trim();
		// add the current signal to the universe
		if (this.signalsService.universe.containsEntity(id)) {
			let bs: any = this.signalsService.universe.getEntity(id);
			if (bs.getContent() === signalStr) { return; }
		}

		// evaluate the formula
		let tf = TemporalEntityInterpreter.evaluate(signalStr, this.signalsService.universe);
		// if entity is valid, add it to the universe
		if (tf) this.signalsService.universe.putEntity(tf);

		this.signalsString = Symbols.getEmpty();
		// update the graphical charts and save the universe's and
		// formulas manager's states
		this.updateSignalsCharts();
		this.signalsService.saveUniverse();

		// clean the text field
		form.form.markAsPristine();
		form.form.markAsUntouched();
	}

	// update the boolean signal corresponding to the provided ID
	updateSignal(event: Event, id: any): void {
		let s: any = this.signalsService.universe.getEntity(id);
		let str = this.editableSignal.text.trim();
		// skip the processing if it's not necessary
		if (s.getContent().trim() === str) {
			this.disableSignalEditor(event, id);
			return;
		}

		// evaluate the formula
		s = TemporalEntityInterpreter.evaluate(str, this.signalsService.universe);
		if (s != null) {
			this.signalsService.universe.putEntity(s);
			// TODO: Improve to update only self and parents entites
			this.signalsService.universe.reevaluateAllEntities();

			// update the graphical charts and save the universe's states
			this.updateSignalsCharts();
			this.signalsService.saveUniverse();

			// hide the editor
			this.disableSignalEditor(event, id);
		}
	}

	// remove the boolean signal corresponding to the provided ID
	removeSignal(id: any): void {
		this.signalsService.universe.removeEntity(id);

		// recalculate the universe's length by
		// taking into account the formulas' associated
		// boolean signals
		this.signalsService.universe.recalculateMaxLength();

		// update the graphical charts and save the universe's and
		// formulas manager's states
		this.updateSignalsCharts();
		this.signalsService.saveUniverse();
	}

	// generate random boolean signals
	generateSignals(): void {
		this.signalsString = generateBooleanSignals(this.signalsService.universe);
	}

	// generate a random temporal formulas
	generateFormula(): void {
		// LTLFormulaGenerator
		this.signalsString = generateTemporalFormula(this.signalsService.universe);
	}

	// clear the universe
	clearSignals(): void {
		this.signalsService.universe.clear();
		// save universe
		this.signalsService.saveUniverse();
	}

	canBeAnalyzed(entity: any): boolean {
		// Entity can't be analyzed if it contains static signal
		let content = entity.content;
		if (content.indexOf('0') >= 0 || content.indexOf('1') >= 0) return false;

		return true;
	}

	isBeingAnalyzed(id: any): boolean {
		return this.analyses.indexOf(id) >= 0;
	}

	analyzeEntity(id: any): void {
		if (this.analyses.indexOf(id) >= 0) return;
		let entity: any = this.signalsService.universe.getEntity(id);
		if (entity == null || !this.canBeAnalyzed(entity)) return;

		this.analyses.push(id);
		this.satService.checkInformation(entity.content).then((report) => {
			let index = this.analyses.indexOf(id);
			if (index < 0) return;
			this.analyses.splice(index, 1);

			let sat;
			if (report == null) {
				sat = 'Unknown';
			} else if (report.isTautology) {
				sat = 'Tautology';
			} else if (report.isSatisfiable) {
				sat = 'Satisfiable';
			} else {
				sat = 'Insatisfiable';
			}
			entity.satisfiability = sat;
		});
	}

	minimizeUniverse(): void {
		this.signalsService.universe.minimize();
		this.updateSignalsCharts();
		this.signalsService.saveUniverse();
	}

	/**
	 * ******************** ngForOf trackBy ********************
	 */

	trackById(index: number, entity: any): number {
		return entity.getId();
	}

	reverseSortById(array: TemporalEntity[]): TemporalEntity[] {
		return array.sort((a, b) => {
			let p1 = a.getId();
			let p2 = b.getId();
			return p1 > p2 ? -1 : (p1 < p2 ? 1 : 0);
		});
	}

	sortById(array: TemporalEntity[]): TemporalEntity[] {
		return array.sort((a, b) => {
			let p1 = a.getId();
			let p2 = b.getId();
			return p1 > p2 ? 1 : (p1 < p2 ? -1 : 0);
		});
	}
}
