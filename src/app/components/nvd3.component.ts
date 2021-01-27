/// <reference types="nvd3"/>

import { Component, ElementRef, HostListener } from '@angular/core';
import { NvD3Component as _NvD3Component } from 'ng2-nvd3';

declare global {
    namespace nv {
        interface LineChart {
            readonly container: Node;
        }

        type Data = any;
        type Options = any;
    }
}

@Component({
    selector: 'app-nvd3',
    template: ``,
})
export class NvD3Component extends _NvD3Component {

    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

    initChart(options: nv.Options): void {
        if (options) {
            const callback = options.chart.callback;
            options.chart.callback = (chart: nv.Chart) => {
                this.updateWithOptions(options);
                if (callback) {
                    callback(chart);
                }
            };
        }
        super.initChart(options);
    }

    updateWithOptions(options: nv.Options): void {
        super.updateWithOptions(options);

        // Chart not yet ready
        if (!this.chart) {
            return;
        }

        if (this.chart.resizeHandler) {
            this.chart.resizeHandler.clear();
            this.chart.resizeHandler = null;
        }

        this.updateChart();
    }

    @HostListener('window:resize')
    updateChart(): void {
        const chart: nv.LineChart = this.chart;

        if (!chart || !chart.update) {
            return;
        }

        const xMax = chart.xScale().domain().slice(-1)[0];
        chart.xAxis
            .ticks(null)
            .tickValues(d3.range(xMax + 1))
            .tickFormat(d3.format(',.0f'));

        chart.yAxis
            .ticks(null)
            .tickValues(d3.range(2))
            .tickFormat(d3.format(',.0f'));

        chart.xAxis.ticks(d3.time.second, 1);

        chart.update();

        chart.xAxis.ticks(d3.time.second, 1);

        const fmt = chart.xAxis.tickFormat();
        const scale = chart.xAxis.scale();
        const container = d3.select(chart.container).select('g.nv-x');
        const wrap = container.selectAll('g.nv-wrap.nv-axis');
        const g = wrap.select('g');
        const xTicks = g.selectAll('g').select('text');
        const axisMaxMin = wrap.selectAll('g.nv-axisMaxMin');

        let lastIdx = 0;
        xTicks.attr('transform', (d: nv.Data, i: number) => {
            lastIdx = i;
            if (i === 0) i = 1;
            return 'translate(' + -scale(d) / (2 * i) + ', 0)';
        }).text((d: nv.Data) => {
            const v = Number(fmt(d));
            return ('' + v).match('NaN') ? '' : (v - 1);
        });

        lastIdx = (lastIdx + 1) * 2;
        axisMaxMin.select('text')
            .attr('transform', (d: nv.Data) => {
                const translateX = -scale(d) / lastIdx;
                return 'translate(' + translateX + ', 0)';
            })
            .text((d: nv.Data) => {
                const v = Number(fmt(d));
                return (('' + v).match('NaN') || (v <= 0)) ? '' : (v - 1);
            });
    }
}
