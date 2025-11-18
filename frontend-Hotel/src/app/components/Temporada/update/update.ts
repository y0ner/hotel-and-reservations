import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { SeasonService } from '../../../services/Season.service';
import { SeasonResponseI } from '../../../models/Season';

@Component({
  selector: 'app-season-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    ToastModule,
    CardModule,
    RouterModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  entityId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private seasonService: SeasonService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      price_multiplier: [1, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE', []],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entityId = parseInt(id, 10);
      this.loadData();
    } else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de temporada no proporcionado' });
    }
  }

  loadData(): void {
    this.loading = true;
    this.seasonService.getById(this.entityId).subscribe({
      next: (data: SeasonResponseI) => {
        // PrimeNG calendar expects Date objects
        const seasonData = {
            ...data,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date)
        };
        this.form.patchValue(seasonData);
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos de la temporada' });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      let formData = this.form.value;

      this.seasonService.update(this.entityId, formData).subscribe({
        next: (response: SeasonResponseI) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Temporada actualizada correctamente' });
          setTimeout(() => this.router.navigate(['/Temporada']), 1000);
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Error al actualizar la temporada' });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/Temporada']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) return 'El campo es requerido.';
      if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}.`;
    }
    return '';
  }
}