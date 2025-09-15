// src/app/components/report/getall/getall.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ReportService } from '../../../services/report.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-getall-reports',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './getall.html',
})
export class GetallComponent {
  reportData$: Observable<any>;
  chartOptions: any;

  constructor(private reportService: ReportService) {
    this.reportData$ = this.reportService.reportData$;
    
    // Opciones básicas para el gráfico
    this.chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
  }
}