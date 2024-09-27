import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import Highcharts from 'highcharts';

@Directive({
  selector: '[appChart]',
  standalone: true
})
export class ChartDirective implements OnChanges {
  @Input() chartOptions!: Highcharts.Options;
  @Input() chartType: string = 'line';  // Тип графика
  @Input() colors: string[] = [];  // Массив цветов
  @Input() chartData: any = [];  // Массив данных для каждой серии

  constructor(private elRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartOptions'] || changes['chartType'] || changes['colors'] || changes['chartData']) {
      this.renderChart();
    }
  }

  private renderChart() {
    const options = {
      ...this.chartOptions,
      chart: {type: this.chartType},
      series: this.chartOptions.series?.map((series: any, index: number) => ({
        ...series,
        color: this.colors[index] || series.color,
        data: this.chartData[index] || series.data,
      })),
    };

    Highcharts.chart(this.elRef.nativeElement, options);
  }
}
