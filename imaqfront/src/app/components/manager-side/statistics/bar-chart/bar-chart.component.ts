import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto'

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements AfterViewInit, OnChanges {
    @ViewChild('chartCanvas', { static: true }) chartCanvas: ElementRef;
    @ViewChild('canvasContainer', { static: true }) canvasContainer: ElementRef;
    private chart: Chart;
    @Input() dataEntries: { label: any, data: number }[];
    @Input() label: any = 'Default';
    colors = ["#9b5fe0", "#16a4d8", "#60dbe8", "#8bd346", "#efdf48", "#f9a52c", "#d64e12"]

    ngAfterViewInit(): void {
        const ctx: CanvasRenderingContext2D = this.chartCanvas.nativeElement.getContext('2d');
        let data = {
            labels: [],
            datasets: [{
                label: this.label,
                data: [],
                backgroundColor: this.colors.slice(0, this.dataEntries.length),
                borderWidth: 1,
                barThickness: 40
            }]
        }
        this.dataEntries.forEach(x => {
            data.labels.push(x.label as never);
            data.datasets[0].data.push(x.data as never);
        })
        this.canvasContainer.nativeElement.style.height = (this.dataEntries.length * (40 + 30) + 30) + 'px';
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },

                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => { context[0].label = context[0].label.replace(/,/g, ' ') }
                        }
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: this.label,
                        position: 'bottom'
                    }
                }
            }
        });

    }

    ngOnChanges(): void {
        this.updateChart();
    }

    updateChart(): void {
        let data = {
            labels: [],
            datasets: [{
                label: this.label,
                data: [],
                backgroundColor: this.colors.slice(0, this.dataEntries.length),
                borderWidth: 1,
                barThickness: 40
            }]
        }
        this.dataEntries.forEach(x => {
            data.labels.push(x.label as never);
            data.datasets[0].data.push(x.data as never);
        })
        this.chart.data = data;
        this.canvasContainer.nativeElement.style.height = (this.dataEntries.length * (40 + 30) + 30) + 'px';
        this.chart.update();
    }
}
