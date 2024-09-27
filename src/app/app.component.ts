import {Component, DestroyRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {PermissionCheckButtonDirective} from "./shared/directives/permission-check-button.directive";
import {MatTooltip} from "@angular/material/tooltip";
import {catchError, forkJoin, of, startWith, switchMap} from "rxjs";
import {MatToolbar} from "@angular/material/toolbar";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {
  MatDatepicker,
  MatDatepickerInput, MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {ChartDirective} from "./shared/directives/chart.directive";
import {HighchartsChartModule} from "highcharts-angular";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TemperatureService} from "./shared/services/temperature.service";
import {HumidityService} from "./shared/services/humidity.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButton,
    PermissionCheckButtonDirective,
    MatTooltip,
    MatToolbar,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    ChartDirective,
    HighchartsChartModule,
    MatSelect,
    MatOption,
    FormsModule,
    ReactiveFormsModule,
    MatDateRangePicker,
    MatDateRangeInput,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatLabel,
    MatHint
  ],
  providers: [
    TemperatureService,
    HumidityService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected dateRangeControl = new FormControl(new Date(2024, 6, 1))

  protected charts: Array<{
    chartOptions: any;
    chartType: string;
    colors: string[];
    data: number[][][]; // Массив массивов чисел
  }> = [
    {
      chartOptions: this.createChartOptions(['Temperature 1']),
      chartType: 'line',
      colors: ['#FF0000'],
      data: [],
    },
    {
      chartOptions: this.createChartOptions(['Humidity']),
      chartType: 'bar',
      colors: ['#0000FF'],
      data: [],
    },
  ];

  constructor(
    private destroyRef: DestroyRef,
    private temperatureService: TemperatureService,
    private humidityService: HumidityService
  ) {
  }

  ngOnInit() {
    this.dateRangeControl.valueChanges
      .pipe(
        startWith(this.dateRangeControl.value),
        switchMap((date) => {
          if (date) {
            return forkJoin({
              temperatureData: this.temperatureService.getTemperatureData(date),
              humidityData: this.humidityService.getHumidityData(date)
            }).pipe(
              catchError(() => {
                return of({temperatureData: null, humidityData: null}); // Возвращаем пустые данные в случае ошибки
              })
            );
          }
          return [{
            temperatureData: null,
            humidityData: null
          }];
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({temperatureData, humidityData}) => {
        if (temperatureData) {
          this.charts[0].data = [
            temperatureData.temperatures?.map((temperature, i) => [new Date(temperatureData.time[i]).getTime(), temperature]),
          ]
        }

        if (humidityData) {
          this.charts[1].data = [
            humidityData.temperatures?.map((humidity, i) => [new Date(humidityData.time[i]).getTime(), humidity]),
          ]
        }

      });
  }

  protected createChartOptions(sensors: string[]) {
    return {
      title: {text: 'Sensor Data'},
      xAxis: {
        type: 'datetime',
      },
      series: sensors.map(sensor => ({
        name: sensor,
        data: [],
      })),
    };
  }

  protected updateChartType(type: string, index: number) {
    this.charts[index].chartType = type
  }
}
