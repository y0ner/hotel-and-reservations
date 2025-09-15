// src/app/components/dashboard/dashboard.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ReportService } from '../../services/report.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  reportData$: Observable<any>;
  chartOptions: any;

  constructor(private reportService: ReportService) {
    this.reportData$ = this.reportService.reportData$;
    
    // Opciones para el gráfico (puedes personalizarlas más si quieres)
    this.chartOptions = {
        plugins: {
            legend: {
                display: false // Ocultamos la leyenda para un look más limpio
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#6b7280' },
                grid: { color: '#f3f4f6' }
            },
            x: {
                ticks: { color: '#6b7280' },
                grid: { color: '#f3f4f6' }
            }
        }
    };
  }
}